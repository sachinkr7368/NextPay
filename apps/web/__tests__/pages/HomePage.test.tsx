import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock the Navbar component
jest.mock('@/components/navbar', () => ({
  Navbar: () => <div>Mocked Navbar</div>,
}))

describe('HomePage', () => {
  it('renders hero section with main heading', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Launch Your SaaS Faster/i)).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Secure Authentication')).toBeInTheDocument()
    expect(screen.getByText('Stripe Payments')).toBeInTheDocument()
    expect(screen.getByText('Modern Stack')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Get Started Free')).toBeInTheDocument()
    expect(screen.getByText('View Pricing')).toBeInTheDocument()
  })

  it('renders benefits section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Why Choose NextPay?')).toBeInTheDocument()
    expect(screen.getByText(/Production-ready code/i)).toBeInTheDocument()
  })
})

