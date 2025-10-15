import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface PricingCardProps {
  name: string
  description: string
  price: string
  features: string[]
  popular?: boolean
  onSelect: () => void
  isCurrentPlan?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  onManage?: () => void
}

export function PricingCard({ 
  name, 
  description, 
  price, 
  features, 
  popular = false,
  onSelect,
  isCurrentPlan = false,
  isLoading = false,
  isDisabled = false,
  onManage
}: PricingCardProps) {
  return (
    <Card className={`relative ${
      popular ? 'border-primary shadow-lg scale-105' : ''
    } ${
      isCurrentPlan ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
    } ${
      isDisabled ? 'opacity-60' : ''
    }`}>
      {popular && !isCurrentPlan && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Current Plan
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCurrentPlan && price !== 'Free' && onManage ? (
          <div className="w-full space-y-2">
            <Button 
              className="w-full" 
              variant="default"
              onClick={onManage}
            >
              Manage Subscription
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Cancel, change plan, or update payment method
            </p>
          </div>
        ) : (
          <Button 
            className="w-full" 
            variant={
              isCurrentPlan ? 'secondary' : 
              popular ? 'default' : 'outline'
            }
            onClick={onSelect}
            disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              'Processing...'
            ) : isCurrentPlan ? (
              'Current Plan'
            ) : price === 'Free' ? (
              'Get Started'
            ) : (
              'Subscribe'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

