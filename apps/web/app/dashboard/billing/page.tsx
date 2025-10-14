'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useSWR from 'swr'
import apiClient from '@/lib/axios'
import { CheckCircle } from 'lucide-react'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

export default function BillingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/auth/signin?redirect=/dashboard/billing')
    }
  }, [router])

  const { data: subscription } = useSWR('/payments/subscription', fetcher)
  const { data: invoices } = useSWR('/payments/invoices', fetcher)

  const handleManageBilling = async () => {
    try {
      const response = await apiClient.post('/payments/create-portal-session')
      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Failed to open billing portal', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing information</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your subscription plan and billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{subscription?.plan || 'Free'} Plan</h3>
                    <p className="text-muted-foreground">
                      {subscription?.status === 'active' ? (
                        <Badge className="mt-1">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="mt-1">
                          {subscription?.status || 'Inactive'}
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {subscription?.amount && (
                      <>
                        <p className="text-3xl font-bold">${subscription.amount}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </>
                    )}
                  </div>
                </div>

                {subscription?.nextBillingDate && (
                  <p className="text-sm text-muted-foreground">
                    Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-4">
                  <Button onClick={() => router.push('/pricing')}>
                    Change Plan
                  </Button>
                  {subscription?.customerId && (
                    <Button variant="outline" onClick={handleManageBilling}>
                      Manage Billing
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and download receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices && invoices.length > 0 ? (
                  invoices.map((invoice: any) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(invoice.created).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold">${(invoice.amount / 100).toFixed(2)}</p>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                        {invoice.invoicePdf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(invoice.invoicePdf, '_blank')}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No billing history available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

