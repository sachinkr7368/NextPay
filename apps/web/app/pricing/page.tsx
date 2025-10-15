'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { PricingCard } from '@/components/pricing-card'
import { useToast } from '@/components/ui/use-toast'
import apiClient from '@/lib/axios'

export default function PricingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const plans = [
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
      price: '$29',
      priceId: 'price_1SI58JLV9XDn5rbH7mHIsqWj',
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
      price: '$99',
      priceId: 'price_1SI5BRLV9XDn5rbH3yQsOsLs',
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

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin?redirect=/pricing')
      return
    }

    if (plan.priceId === null) {
      toast({
        title: 'Already on free plan',
        description: 'You are already using the free tier.',
      })
      return
    }

    setLoading(true)
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
      setLoading(false)
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
            Choose the plan that's right for you. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              popular={plan.popular}
              onSelect={() => handleSelectPlan(plan)}
            />
          ))}
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p>All plans include a 14-day free trial. No credit card required.</p>
          <p className="mt-2">Use test cards for development: 4242 4242 4242 4242</p>
        </div>
      </div>
    </div>
  )
}

