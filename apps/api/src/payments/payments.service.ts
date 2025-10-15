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
    
    let event: Stripe.Event;
    
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

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
    }

    return { received: true };
  }

  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) return;
    
    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    
    const priceId = subscription.items.data[0].price.id;
    let plan = 'free';
    
    if (priceId === this.configService.get('STRIPE_PRICE_PRO')) {
      plan = 'pro';
    } else if (priceId === this.configService.get('STRIPE_PRICE_ENTERPRISE')) {
      plan = 'enterprise';
    }

    await this.usersService.updateSubscription(
      userId,
      plan,
      session.customer as string,
      session.subscription as string,
    );
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription) {
    const customer = await this.stripe.customers.retrieve(
      subscription.customer as string,
    );
    
    if (customer.deleted) return;

    const userId = customer.metadata?.userId;
    if (!userId) return;

    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
      await this.usersService.updateSubscription(
        userId,
        'free',
        customer.id,
        undefined,
      );
    }
  }
}

