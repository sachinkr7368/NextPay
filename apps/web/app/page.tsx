import Link from 'next/link'
import { ArrowRight, CheckCircle, CreditCard, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Launch Your SaaS Faster
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            NextPay is a production-ready SaaS starter with authentication, payments, 
            and everything you need to ship your product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Build a SaaS
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-muted-foreground">
              JWT-based auth with social login support. Production-ready security out of the box.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stripe Payments</h3>
            <p className="text-muted-foreground">
              Full subscription management with tiered pricing and billing history.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
            <p className="text-muted-foreground">
              Built with Next.js, NestJS, PostgreSQL, and TypeScript for maximum performance.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-card/50 rounded-lg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose NextPay?
          </h2>
          <div className="space-y-4">
            {[
              'Production-ready code following best practices',
              'Full TypeScript type safety across frontend and backend',
              'Docker containerization for easy deployment',
              'Comprehensive testing setup included',
              'Admin dashboard for user and payment management',
              'SEO optimized with meta tags and sitemaps',
              'Mobile-responsive modern UI',
              'CI/CD pipeline configuration included',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your SaaS?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start with a free plan and upgrade as you grow.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6" />
              <span className="font-bold">NextPay</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <a href="http://localhost:3001/api/docs" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                API Docs
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NextPay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
