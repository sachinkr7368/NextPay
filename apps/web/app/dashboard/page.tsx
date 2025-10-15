'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react'
import useSWR from 'swr'
import apiClient from '@/lib/axios'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin?redirect=/dashboard')
    }
  }, [router])

  const { data: stats } = useSWR('/users/me/stats', fetcher)
  const { data: subscription } = useSWR('/payments/subscription', fetcher)

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.revenue || '0'}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.subscriptions || '0'}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers || '0'}</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscription?.plan || 'Free'}</div>
              <p className="text-xs text-muted-foreground">
                {subscription?.status || 'Active'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Payment received
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$29.00</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New subscription
                    </p>
                    <p className="text-sm text-muted-foreground">
                      1 day ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Pro Plan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <p className="font-medium">Edit Profile</p>
                <p className="text-sm text-muted-foreground">Update your account information</p>
              </button>
              <button
                onClick={() => router.push('/dashboard/billing')}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <p className="font-medium">Manage Billing</p>
                <p className="text-sm text-muted-foreground">View invoices and update payment methods</p>
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <p className="font-medium">Upgrade Plan</p>
                <p className="text-sm text-muted-foreground">Unlock more features</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

