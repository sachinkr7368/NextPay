'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { PricingCard } from '@/components/pricing-card'
import { useToast } from '@/components/ui/use-toast'
import { Check } from 'lucide-react'
import apiClient from '@/lib/axios'
import useSWR from 'swr'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

export default function PricingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  
  const { data: pricingData } = useSWR('/payments/plans', fetcher)
  const { data: subscription } = useSWR('/payments/subscription', fetcher)

  // Update current plan when subscription data changes
  useEffect(() => {
    if (subscription?.plan) {
      setCurrentPlan(subscription.plan)
    }
  }, [subscription])

  const plans = pricingData?.plans || [
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
      priceId: null,
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
      priceId: null,
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
  ]

  const handleSelectPlan = async (plan: any) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin?redirect=/pricing')
      return
    }

    const planName = plan.name.toLowerCase()
    
    // Check if user is already on this plan
    if (currentPlan === planName) {
      toast({
        title: `Already on ${plan.name} Plan`,
        description: `You are currently using the ${plan.name} plan.`,
      })
      return
    }

    // Check if trying to downgrade (not allowed for now)
    if (currentPlan === 'enterprise' && planName === 'pro') {
      toast({
        title: 'Downgrade Not Available',
        description: 'Please contact support to downgrade your plan.',
        variant: 'destructive',
      })
      return
    }

    if (currentPlan === 'pro' && planName === 'free') {
      toast({
        title: 'Downgrade Not Available',
        description: 'Please contact support to downgrade your plan.',
        variant: 'destructive',
      })
      return
    }

    if (plan.priceId === null) {
      toast({
        title: 'Already on free plan',
        description: 'You are already using the free tier.',
      })
      return
    }

    setLoadingPlan(planName)
    try {
      const response = await apiClient.post('/payments/create-checkout-session', {
        priceId: plan.priceId,
      })
      
      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to start checkout',
        variant: 'destructive',
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. Upgrade anytime, contact support for downgrades.
          </p>
          {currentPlan && currentPlan !== 'free' && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
              <Check className="mr-2 h-4 w-4" />
              You're currently on the {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan: any) => {
            const planName = plan.name.toLowerCase()
            const isCurrentPlan = currentPlan === planName
            const isUpgrade = 
              (currentPlan === 'free' && planName === 'pro') ||
              (currentPlan === 'free' && planName === 'enterprise') ||
              (currentPlan === 'pro' && planName === 'enterprise')
            const isDowngrade = 
              (currentPlan === 'enterprise' && planName === 'pro') ||
              (currentPlan === 'pro' && planName === 'free') ||
              (currentPlan === 'enterprise' && planName === 'free')
            
            return (
              <PricingCard
                key={plan.name}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                popular={plan.popular && !isCurrentPlan}
                onSelect={() => handleSelectPlan(plan)}
                isCurrentPlan={isCurrentPlan}
                isLoading={loadingPlan === planName}
                isDisabled={isCurrentPlan || isDowngrade}
              />
            )
          })}
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p>All plans include a 14-day free trial. No credit card required.</p>
          <p className="mt-2">Use test cards for development: 4242 4242 4242 4242</p>
        </div>
      </div>
    </div>
  )
}

