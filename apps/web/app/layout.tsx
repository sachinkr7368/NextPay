import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextPay - Production-Ready SaaS Starter',
  description: 'Launch your SaaS product faster with NextPay - a complete starter with authentication, payments, and more.',
  keywords: ['saas', 'starter', 'nextjs', 'stripe', 'authentication'],
  authors: [{ name: 'NextPay' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#3B82F6',
  viewport: 'width=device-width, initial-scale=1',
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
