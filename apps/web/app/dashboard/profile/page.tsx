'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Crown } from 'lucide-react'
import apiClient from '@/lib/axios'
import useSWR from 'swr'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    plan: 'free',
  })

  const { data: subscription, mutate } = useSWR('/payments/subscription', fetcher)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/signin?redirect=/dashboard/profile')
      return
    }

    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/users/me')
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
        plan: response.data.plan || 'free',
      })
    } catch (error) {
      console.error('Failed to fetch profile', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Don't send email or plan in update request
      const { email, plan, ...updateData } = formData
      await apiClient.patch('/users/me', updateData)
      
      // Refresh profile data
      await fetchProfile()
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSyncSubscription = async () => {
    setSyncing(true)
    try {
      const response = await apiClient.post('/payments/sync-subscription')
      
      if (response.data.synced) {
        toast({
          title: 'Plan Updated!',
          description: `Your plan has been updated from ${response.data.oldPlan} to ${response.data.newPlan}`,
        })
        // Refresh both subscription and profile data
        mutate()
        await fetchProfile()
      } else {
        toast({
          title: 'Already Up to Date',
          description: response.data.message,
        })
      }
    } catch (error: any) {
      toast({
        title: 'Sync Failed',
        description: error.response?.data?.message || 'Failed to sync subscription',
        variant: 'destructive',
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your subscription plan and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold capitalize">{formData.plan} Plan</h3>
                      {formData.plan !== 'free' && (
                        <Badge variant="default">Premium</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.plan === 'free' && 'Upgrade to unlock all features'}
                      {formData.plan === 'pro' && 'Advanced features unlocked'}
                      {formData.plan === 'enterprise' && 'All features unlocked'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSyncSubscription}
                    disabled={syncing}
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => router.push('/pricing')}
                  >
                    {formData.plan === 'free' ? 'Upgrade' : 'Change Plan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-2xl">
                      {formData.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    Change Avatar
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted cursor-not-allowed"
                      placeholder="you@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

