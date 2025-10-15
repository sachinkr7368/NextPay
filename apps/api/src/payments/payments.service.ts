import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(userId: string, priceId: string) {
    const user = await this.usersService.findOne(userId);
    
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await this.usersService.updateSubscription(userId, user.plan, customerId);
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user.stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing`,
    });

    return { url: session.url };
  }

  async getSubscription(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user.stripeSubscriptionId) {
      return {
        plan: user.plan,
        status: 'active',
      };
    }

    const subscription = await this.stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
    );

    return {
      plan: user.plan,
      status: subscription.status,
      amount: (subscription.items.data[0]?.price.unit_amount || 0) / 100,
      nextBillingDate: new Date(subscription.current_period_end * 1000),
      customerId: user.stripeCustomerId,
    };
  }

  async getInvoices(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user.stripeCustomerId) {
      return [];
    }

    const invoices = await this.stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    return invoices.data.map((invoice: any) => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      created: invoice.created * 1000,
      status: invoice.status,
      invoicePdf: invoice.invoice_pdf,
      description: invoice.lines.data[0]?.description || 'Subscription',
    }));
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      throw new Error('Webhook secret not configured');
    }
    
    let event: Stripe.Event;
    
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
      console.log(`Webhook received: ${event.type}`);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleCheckoutComplete(session);
          break;
        }
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionChange(subscription);
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing webhook ${event.type}:`, error);
      throw error;
    }

    return { received: true };
  }

  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in checkout session metadata');
      return;
    }
    
    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    
    const priceId = subscription.items.data[0].price.id;
    let plan = 'free';
    
    const proPriceId = this.configService.get('STRIPE_PRICE_PRO');
    const enterprisePriceId = this.configService.get('STRIPE_PRICE_ENTERPRISE');
    
    console.log('Webhook - Price comparison:', {
      receivedPriceId: priceId,
      proPriceId,
      enterprisePriceId,
    });
    
    if (priceId === proPriceId) {
      plan = 'pro';
    } else if (priceId === enterprisePriceId) {
      plan = 'enterprise';
    } else {
      console.warn(`Unknown price ID: ${priceId}`);
    }

    console.log(`Updating user ${userId} to ${plan} plan`);
    
    await this.usersService.updateSubscription(
      userId,
      plan,
      session.customer as string,
      session.subscription as string,
    );
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription) {
    try {
      const customer = await this.stripe.customers.retrieve(
        subscription.customer as string,
      );
      
      if (customer.deleted) {
        console.log('Customer deleted, skipping subscription update');
        return;
      }

      const userId = customer.metadata?.userId;
      if (!userId) {
        console.error('No userId in customer metadata for subscription:', subscription.id);
        return;
      }

      console.log(`Processing subscription change for user ${userId}: ${subscription.status}`);

      if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
        await this.usersService.updateSubscription(
          userId,
          'free',
          customer.id,
          undefined,
        );
        console.log(`Downgraded user ${userId} to free plan`);
      } else if (subscription.status === 'active') {
        // If subscription is active, sync the plan based on price ID
        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId) {
          const proPriceId = this.configService.get('STRIPE_PRICE_PRO');
          const enterprisePriceId = this.configService.get('STRIPE_PRICE_ENTERPRISE');
          
          let plan = 'free';
          if (priceId === proPriceId) {
            plan = 'pro';
          } else if (priceId === enterprisePriceId) {
            plan = 'enterprise';
          }
          
          await this.usersService.updateSubscription(
            userId,
            plan,
            customer.id,
            subscription.id,
          );
          console.log(`Updated user ${userId} to ${plan} plan`);
        }
      }
    } catch (error) {
      console.error('Error in handleSubscriptionChange:', error);
      throw error;
    }
  }

  async syncSubscription(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user.stripeSubscriptionId) {
      return {
        synced: false,
        message: 'No active subscription to sync',
        currentPlan: user.plan,
      };
    }

    try {
      const subscription = await this.stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
      );

      const priceId = subscription.items.data[0].price.id;
      let plan = 'free';

      const proPriceId = this.configService.get('STRIPE_PRICE_PRO');
      const enterprisePriceId = this.configService.get('STRIPE_PRICE_ENTERPRISE');

      if (priceId === proPriceId) {
        plan = 'pro';
      } else if (priceId === enterprisePriceId) {
        plan = 'enterprise';
      }

      // Only update if plan has changed
      if (user.plan !== plan) {
        await this.usersService.updateSubscription(
          userId,
          plan,
          user.stripeCustomerId,
          user.stripeSubscriptionId,
        );

        return {
          synced: true,
          message: 'Subscription synced successfully',
          oldPlan: user.plan,
          newPlan: plan,
          subscriptionStatus: subscription.status,
        };
      }

      return {
        synced: false,
        message: 'Subscription already up to date',
        currentPlan: user.plan,
        subscriptionStatus: subscription.status,
      };
    } catch (error: any) {
      return {
        synced: false,
        message: 'Failed to sync subscription',
        error: error.message,
      };
    }
  }

  async getPricingPlans() {
    return {
      plans: [
        {
          name: 'Free',
          description: 'Perfect for trying out NextPay',
          price: 'Free',
          priceId: null,
          features: [
            '1 user',
            'Basic features',
            'Community support',
            '1 GB storage',
            'Email support',
          ],
        },
        {
          name: 'Pro',
          description: 'For growing businesses',
          price: '$15',
          priceId: this.configService.get('STRIPE_PRICE_PRO'),
          features: [
            '10 users',
            'All features',
            'Priority support',
            '100 GB storage',
            'Advanced analytics',
            'API access',
          ],
          popular: true,
        },
        {
          name: 'Enterprise',
          description: 'For large organizations',
          price: '$25',
          priceId: this.configService.get('STRIPE_PRICE_ENTERPRISE'),
          features: [
            'Unlimited users',
            'All features',
            '24/7 phone support',
            'Unlimited storage',
            'Advanced analytics',
            'API access',
            'Custom integrations',
            'SLA guarantee',
          ],
        },
      ],
    };
  }

  async debugConfig() {
    const config = {
      stripeSecretKey: this.configService.get('STRIPE_SECRET_KEY') ? '✅ Set' : '❌ Missing',
      stripePricePro: this.configService.get('STRIPE_PRICE_PRO') || '❌ Missing',
      stripePriceEnterprise: this.configService.get('STRIPE_PRICE_ENTERPRISE') || '❌ Missing',
      stripePriceFree: this.configService.get('STRIPE_PRICE_FREE') || '❌ Missing',
      stripeWebhookSecret: this.configService.get('STRIPE_WEBHOOK_SECRET') ? '✅ Set' : '❌ Missing',
      frontendUrl: this.configService.get('FRONTEND_URL') || '❌ Missing',
    };

    // Test if Stripe prices exist
        const priceTests: Record<string, any> = {};
        const prices = ['STRIPE_PRICE_PRO', 'STRIPE_PRICE_ENTERPRISE', 'STRIPE_PRICE_FREE'];
        
        for (const priceKey of prices) {
          const priceId = this.configService.get(priceKey);
          if (priceId) {
            try {
              const price = await this.stripe.prices.retrieve(priceId);
              priceTests[priceKey] = {
                exists: true,
                id: price.id,
                amount: price.unit_amount,
                currency: price.currency,
                active: price.active,
              };
            } catch (error: any) {
              priceTests[priceKey] = {
                exists: false,
                id: priceId,
                error: error.message,
              };
            }
          }
        }

    return {
      ...config,
      priceTests,
    };
  }
}

