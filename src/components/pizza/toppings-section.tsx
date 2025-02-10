'use client'

import { useState } from 'react'
import { Topping } from '@/lib/types/cart'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

interface ToppingsSectionProps {
  selectedToppings: Topping[]
  onToppingsChange: (toppings: Topping[]) => void
  availableToppings: Topping[]
  maxToppings?: number
}

export function ToppingsSection({
  selectedToppings,
  onToppingsChange,
  availableToppings,
  maxToppings = 5
}: ToppingsSectionProps) {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = ['all', ...new Set(availableToppings.map((t) => t.category))]

  const filteredToppings = activeCategory === 'all'
    ? availableToppings
    : availableToppings.filter((t) => t.category === activeCategory)

  const handleToppingToggle = (topping: Topping) => {
    const isSelected = selectedToppings.some((t) => t.id === topping.id)
    
    if (isSelected) {
      onToppingsChange(selectedToppings.filter((t) => t.id !== topping.id))
    } else {
      if (selectedToppings.length >= maxToppings) {
        toast({
          title: 'Maximum toppings reached',
          description: `You can only select up to ${maxToppings} toppings.`,
          variant: 'destructive'
        })
        return
      }
      onToppingsChange([...selectedToppings, topping])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {filteredToppings.map((topping) => {
          const isSelected = selectedToppings.some((t) => t.id === topping.id)
          return (
            <Button
              key={topping.id}
              variant={isSelected ? 'default' : 'outline'}
              className="h-auto flex-col gap-1 p-4"
              onClick={() => handleToppingToggle(topping)}
            >
              <span className="text-sm font-medium">{topping.name}</span>
              <span className="text-xs text-muted-foreground">
                +${topping.price.toFixed(2)}
              </span>
            </Button>
          )
        })}
      </div>
      {selectedToppings.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <p className="w-full text-sm font-medium">Selected Toppings:</p>
          {selectedToppings.map((topping) => (
            <Button
              key={topping.id}
              variant="secondary"
              size="sm"
              onClick={() => handleToppingToggle(topping)}
            >
              {topping.name} (${topping.price.toFixed(2)})
            </Button>
          ))}
        </div>
      )}
    </div>
  )
} 