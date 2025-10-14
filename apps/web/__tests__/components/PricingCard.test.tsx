import { render, screen, fireEvent } from '@testing-library/react'
import { PricingCard } from '@/components/pricing-card'

describe('PricingCard', () => {
  const mockOnSelect = jest.fn()

  const defaultProps = {
    name: 'Pro',
    description: 'For growing businesses',
    price: '$29',
    features: ['10 users', 'All features', 'Priority support'],
    onSelect: mockOnSelect,
  }

  it('renders pricing card with correct information', () => {
    render(<PricingCard {...defaultProps} />)
    
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('For growing businesses')).toBeInTheDocument()
    expect(screen.getByText('$29')).toBeInTheDocument()
    expect(screen.getByText('10 users')).toBeInTheDocument()
  })

  it('shows popular badge when popular prop is true', () => {
    render(<PricingCard {...defaultProps} popular={true} />)
    
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('calls onSelect when button is clicked', () => {
    render(<PricingCard {...defaultProps} />)
    
    const button = screen.getByRole('button', { name: /subscribe/i })
    fireEvent.click(button)
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1)
  })

  it('shows correct button text for free plan', () => {
    render(<PricingCard {...defaultProps} price="Free" />)
    
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })
})

