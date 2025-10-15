'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Code, 
  Rocket, 
  Shield, 
  CreditCard, 
  Users, 
  Settings, 
  Zap,
  Check,
  ArrowRight,
  Database,
  Lock,
  Mail,
  FileText
} from 'lucide-react'

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4" variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            Documentation v1.0
          </Badge>
          <h1 className="text-4xl font-bold mb-4">NextPay Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about using NextPay - from getting started to advanced features
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-sm">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Button
                  variant={activeTab === 'getting-started' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('getting-started')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Getting Started
                </Button>
                <Button
                  variant={activeTab === 'authentication' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('authentication')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Authentication
                </Button>
                <Button
                  variant={activeTab === 'payments' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('payments')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payments & Billing
                </Button>
                <Button
                  variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('profile')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </Button>
                <Button
                  variant={activeTab === 'api' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('api')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  API Reference
                </Button>
                <Button
                  variant={activeTab === 'features' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('features')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Features
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            {activeTab === 'getting-started' && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-6 h-6 text-primary" />
                      <CardTitle>Getting Started with NextPay</CardTitle>
                    </div>
                    <CardDescription>
                      Quick guide to start using NextPay
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">What is NextPay?</h3>
                      <p className="text-muted-foreground mb-4">
                        NextPay is a modern SaaS payment platform built with Next.js and NestJS. 
                        It provides secure authentication, subscription management, and a powerful dashboard 
                        to manage your business operations.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
                      <ol className="space-y-4">
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            1
                          </div>
                          <div>
                            <strong>Create an Account</strong>
                            <p className="text-sm text-muted-foreground">
                              Sign up using email/password or Google OAuth at{' '}
                              <a href="/auth/signup" className="text-primary hover:underline">
                                /auth/signup
                              </a>
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            2
                          </div>
                          <div>
                            <strong>Choose Your Plan</strong>
                            <p className="text-sm text-muted-foreground">
                              Start with our Free tier or upgrade to Pro/Enterprise at{' '}
                              <a href="/pricing" className="text-primary hover:underline">
                                /pricing
                              </a>
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            3
                          </div>
                          <div>
                            <strong>Access Your Dashboard</strong>
                            <p className="text-sm text-muted-foreground">
                              View analytics and manage your account at{' '}
                              <a href="/dashboard" className="text-primary hover:underline">
                                /dashboard
                              </a>
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div className="flex gap-4">
                      <Button asChild>
                        <a href="/auth/signup">
                          Get Started <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="/pricing">View Pricing</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Authentication */}
            {activeTab === 'authentication' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-6 h-6 text-primary" />
                      <CardTitle>Authentication</CardTitle>
                    </div>
                    <CardDescription>
                      Secure login and user management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sign Up Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <strong>Email & Password</strong>
                            <p className="text-sm text-muted-foreground">
                              Traditional signup with email verification and secure password hashing
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-primary mt-0.5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                          </svg>
                          <div>
                            <strong>Google OAuth</strong>
                            <p className="text-sm text-muted-foreground">
                              One-click signup using your Google account
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Sign In</h3>
                      <p className="text-muted-foreground mb-3">
                        Access your account at{' '}
                        <a href="/auth/signin" className="text-primary hover:underline">
                          /auth/signin
                        </a>
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          JWT-based authentication
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Secure token storage
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Automatic session management
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Protected routes and API endpoints
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Security Features</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <Lock className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Password Security</strong>
                          <p className="text-sm text-muted-foreground">
                            Bcrypt hashing with salt rounds
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Shield className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">JWT Tokens</strong>
                          <p className="text-sm text-muted-foreground">
                            Secure token-based authentication
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Database className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Data Protection</strong>
                          <p className="text-sm text-muted-foreground">
                            Encrypted database connections
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Users className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Role-Based Access</strong>
                          <p className="text-sm text-muted-foreground">
                            User and admin role management
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <CardTitle>Payments & Billing</CardTitle>
                    </div>
                    <CardDescription>
                      Subscription management powered by Stripe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <strong>Free Plan</strong>
                            <Badge variant="outline">$0/month</Badge>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• 1 user</li>
                            <li>• Basic features</li>
                            <li>• Community support</li>
                            <li>• 1 GB storage</li>
                          </ul>
                        </div>
                        <div className="p-4 border-2 border-primary rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <strong>Pro Plan</strong>
                            <Badge>$15/month</Badge>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• 10 users</li>
                            <li>• All features</li>
                            <li>• Priority support</li>
                            <li>• 100 GB storage</li>
                            <li>• Advanced analytics</li>
                            <li>• API access</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <strong>Enterprise Plan</strong>
                            <Badge variant="outline">$25/month</Badge>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Unlimited users</li>
                            <li>• All features</li>
                            <li>• 24/7 phone support</li>
                            <li>• Unlimited storage</li>
                            <li>• Custom integrations</li>
                            <li>• SLA guarantee</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">How to Subscribe</h3>
                      <ol className="space-y-3">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                          <div>
                            <p className="text-sm">Visit the <a href="/pricing" className="text-primary hover:underline">pricing page</a></p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                          <div>
                            <p className="text-sm">Click "Subscribe" on your preferred plan</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                          <div>
                            <p className="text-sm">Complete payment via Stripe's secure checkout</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
                          <div>
                            <p className="text-sm">Access upgraded features immediately</p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Billing Management</h3>
                      <p className="text-muted-foreground mb-3">
                        Manage your subscription at{' '}
                        <a href="/dashboard/billing" className="text-primary hover:underline">
                          /dashboard/billing
                        </a>
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          View current subscription status
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Access billing portal
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Download invoices
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Update payment methods
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Cancel or modify subscriptions
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-6 h-6 text-primary" />
                      <CardTitle>Dashboard</CardTitle>
                    </div>
                    <CardDescription>
                      Your central hub for monitoring and management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Dashboard Overview</h3>
                      <p className="text-muted-foreground mb-4">
                        Access your personalized dashboard at{' '}
                        <a href="/dashboard" className="text-primary hover:underline">
                          /dashboard
                        </a>
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <strong className="block mb-2">User Statistics</strong>
                          <p className="text-sm text-muted-foreground">
                            View total users, active users, and growth metrics
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <strong className="block mb-2">Revenue Tracking</strong>
                          <p className="text-sm text-muted-foreground">
                            Monitor monthly revenue and subscription trends
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <strong className="block mb-2">Activity Feed</strong>
                          <p className="text-sm text-muted-foreground">
                            Recent activities and important updates
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <strong className="block mb-2">Quick Actions</strong>
                          <p className="text-sm text-muted-foreground">
                            Fast access to common tasks and settings
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Admin Dashboard</h3>
                      <p className="text-muted-foreground mb-3">
                        Admin users have access to additional features at{' '}
                        <a href="/admin" className="text-primary hover:underline">
                          /admin
                        </a>
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          User management and role assignment
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          System-wide statistics and analytics
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Subscription management for all users
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Activity logs and audit trails
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-6 h-6 text-primary" />
                      <CardTitle>Profile Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Profile Information</h3>
                      <p className="text-muted-foreground mb-4">
                        Update your profile at{' '}
                        <a href="/dashboard/profile" className="text-primary hover:underline">
                          /dashboard/profile
                        </a>
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <strong>Name:</strong> Update your display name
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <strong>Email:</strong> View your email (read-only for security)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <strong>Bio:</strong> Add a personal bio or description
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <strong>Avatar:</strong> Upload a profile picture
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Account Security</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <strong className="block mb-1 text-yellow-900 dark:text-yellow-100">
                            Email Changes
                          </strong>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            For security reasons, email addresses cannot be changed directly. 
                            Contact support if you need to update your email.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <strong className="block mb-1">Password Management</strong>
                          <p className="text-sm text-muted-foreground">
                            Change your password from the profile settings page
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* API Reference */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-6 h-6 text-primary" />
                      <CardTitle>API Reference</CardTitle>
                    </div>
                    <CardDescription>
                      REST API documentation and endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">API Documentation</h3>
                      <p className="text-muted-foreground mb-4">
                        Full Swagger documentation available at{' '}
                        <a 
                          href="http://localhost:3001/api/docs" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          http://localhost:3001/api/docs
                        </a>
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Authentication Endpoints</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">POST</Badge>
                          <div>/api/auth/signup</div>
                          <p className="text-xs text-muted-foreground mt-1">Create a new account</p>
                        </div>
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">POST</Badge>
                          <div>/api/auth/signin</div>
                          <p className="text-xs text-muted-foreground mt-1">Login to your account</p>
                        </div>
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">GET</Badge>
                          <div>/api/auth/google</div>
                          <p className="text-xs text-muted-foreground mt-1">Initiate Google OAuth</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">User Endpoints</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">GET</Badge>
                          <div>/api/users/me</div>
                          <p className="text-xs text-muted-foreground mt-1">Get current user profile</p>
                        </div>
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">PATCH</Badge>
                          <div>/api/users/me</div>
                          <p className="text-xs text-muted-foreground mt-1">Update user profile</p>
                        </div>
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">GET</Badge>
                          <div>/api/users/me/stats</div>
                          <p className="text-xs text-muted-foreground mt-1">Get user statistics</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Payment Endpoints</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">POST</Badge>
                          <div>/api/payments/create-checkout-session</div>
                          <p className="text-xs text-muted-foreground mt-1">Create Stripe checkout session</p>
                        </div>
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">GET</Badge>
                          <div>/api/payments/subscription</div>
                          <p className="text-xs text-muted-foreground mt-1">Get subscription details</p>
                        </div>
                        <div className="p-3 border rounded-lg font-mono text-sm">
                          <Badge className="mb-2" variant="outline">GET</Badge>
                          <div>/api/payments/invoices</div>
                          <p className="text-xs text-muted-foreground mt-1">Get billing invoices</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <strong className="block mb-2 text-blue-900 dark:text-blue-100">
                        Authentication Required
                      </strong>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Most API endpoints require a valid JWT token in the Authorization header:
                      </p>
                      <pre className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded text-xs overflow-x-auto">
Authorization: Bearer &lt;your-jwt-token&gt;
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Features */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-6 h-6 text-primary" />
                      <CardTitle>Platform Features</CardTitle>
                    </div>
                    <CardDescription>
                      Comprehensive list of NextPay capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Core Features</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <Zap className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Modern Tech Stack</strong>
                          <p className="text-sm text-muted-foreground">
                            Built with Next.js 15, React 19, NestJS, and TypeScript
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Shield className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Secure Authentication</strong>
                          <p className="text-sm text-muted-foreground">
                            JWT tokens, OAuth2.0, and role-based access control
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <CreditCard className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Stripe Integration</strong>
                          <p className="text-sm text-muted-foreground">
                            Complete payment processing and subscription management
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Database className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">PostgreSQL Database</strong>
                          <p className="text-sm text-muted-foreground">
                            Reliable data storage with TypeORM integration
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Users className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">User Management</strong>
                          <p className="text-sm text-muted-foreground">
                            Profile management, roles, and permissions
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <FileText className="w-5 h-5 text-primary mb-2" />
                          <strong className="block mb-1">Analytics Dashboard</strong>
                          <p className="text-sm text-muted-foreground">
                            Real-time metrics and business insights
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technical Highlights</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Server-side rendering with Next.js
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          RESTful API with NestJS
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Responsive UI with Tailwind CSS
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Dark mode support
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Docker containerization
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          API documentation with Swagger
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          E2E and unit testing
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Production-ready deployment
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 border-t">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="http://localhost:3001/api/docs" target="_blank">
                  API Docs
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@nextpay.com">
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/sachinkr7368/nextpay" target="_blank">
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

