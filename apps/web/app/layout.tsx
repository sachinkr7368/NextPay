import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextPay - Production-Ready SaaS Starter',
  description: 'Launch your SaaS product faster with NextPay - a complete starter with authentication, payments, and more.',
  keywords: ['saas', 'starter', 'nextjs', 'stripe', 'authentication'],
  authors: [{ name: 'NextPay' }],
  openGraph: {
    title: 'NextPay - Production-Ready SaaS Starter',
    description: 'Launch your SaaS product faster with NextPay',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextPay - Production-Ready SaaS Starter',
    description: 'Launch your SaaS product faster with NextPay',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
