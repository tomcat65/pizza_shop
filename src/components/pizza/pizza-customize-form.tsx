"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { DatabaseTopping } from '@/lib/types/cart'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

interface PizzaCustomizeFormProps {
  toppings: DatabaseTopping[]
  defaultToppingIds: Array<{ id: string; isGrilled: boolean | null }>
  itemType: "pizza" | "cheesesteak"
  size: "Personal (10\")" | "Regular (12\")" | "Family (17\")"
  itemName: string
  onSubmit: (selectedToppings: Array<{ topping: DatabaseTopping; isGrilled?: boolean }>) => void
}

export default function PizzaCustomizeForm({
  toppings,
  defaultToppingIds,
  itemType,
  size,
  itemName,
  onSubmit
}: PizzaCustomizeFormProps) {
  // Initialize with no toppings selected
  const [selectedToppings, setSelectedToppings] = useState<Array<{ topping: DatabaseTopping; isGrilled?: boolean }>>([])

  const handleToppingToggle = (topping: DatabaseTopping, isGrilled?: boolean) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.topping.id === topping.id)
      
      // If topping exists and we're toggling grilled state
      if (exists && isGrilled !== undefined) {
        return prev.map(t => 
          t.topping.id === topping.id 
            ? { ...t, isGrilled } 
            : t
        )
      }
      
      // If topping exists and we're removing it
      if (exists) {
        return prev.filter(t => t.topping.id !== topping.id)
      }
      
      // If topping doesn't exist, add it
      return [...prev, { topping, isGrilled: isGrilled ?? false }]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(selectedToppings)
  }

  const isToppingSelected = (toppingId: string) => {
    return selectedToppings.some(t => t.topping.id === toppingId)
  }

  const getToppingGrilledState = (toppingId: string) => {
    const selected = selectedToppings.find(t => t.topping.id === toppingId)
    return selected?.isGrilled || false
  }

  const getToppingLabel = (topping: DatabaseTopping, isGrilled?: boolean) => {
    const isDefault = defaultToppingIds.some(t => t.id === topping.id)
    const isSelected = selectedToppings.some(t => t.topping.id === topping.id)
    
    let label = topping.name
    if (isGrilled) {
      label = `Grilled ${label}`
    }
    
    // Show XTRA only when selecting a topping that's already included in the pizza
    if (isDefault && isSelected) {
      label = `XTRA-${label}`
    }
    
    if (topping.price > 0) {
      label = `${label} (+$${topping.price.toFixed(2)})`
    }
    
    return label
  }

  // Filter toppings for pizza and group by category
  const pizzaToppings = toppings.filter(t => 
    (t.item_type === 'pizza' || t.item_type === 'both') && 
    t.name !== 'Don Peppino Original Pizza Sauce'
  )
  
  const groupedToppings = pizzaToppings.reduce<Record<string, DatabaseTopping[]>>((acc, topping) => {
    if (!acc[topping.category]) {
      acc[topping.category] = []
    }
    acc[topping.category].push(topping)
    return acc
  }, {})

  // Sort categories in preferred order
  const categories = ['cheese', 'meat', 'veggie'].filter(cat => groupedToppings[cat]?.length > 0)

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customize Your {itemName}</h2>
      <p className="text-gray-600 mb-4">Size: {size}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold capitalize mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupedToppings[category].map(topping => {
                  console.log(`Topping ${topping.name}:`, {
                    category: topping.category,
                    veggie_state: topping.veggie_state,
                    isSelected: isToppingSelected(topping.id)
                  })
                  return (
                  <div key={topping.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={topping.id}
                        checked={isToppingSelected(topping.id)}
                        onCheckedChange={() => handleToppingToggle(topping)}
                      />
                      <label htmlFor={topping.id} className="text-sm">
                        {getToppingLabel(topping, getToppingGrilledState(topping.id))}
                      </label>
                    </div>
                    
                    {/* Show Natural/Grilled options for veggies */}
                    {category === 'veggie' && (
                      <div className="ml-6">
                        <RadioGroup
                          value={getToppingGrilledState(topping.id) ? 'grilled' : 'natural'}
                          onValueChange={(value: 'natural' | 'grilled') => handleToppingToggle(topping, value === 'grilled')}
                          className="flex items-center gap-4"
                          disabled={!isToppingSelected(topping.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="natural" id={`natural-${topping.id}`} />
                            <Label htmlFor={`natural-${topping.id}`} className={`text-sm ${!isToppingSelected(topping.id) ? 'text-gray-400' : ''}`}>
                              Natural
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="grilled" id={`grilled-${topping.id}`} />
                            <Label htmlFor={`grilled-${topping.id}`} className={`text-sm ${!isToppingSelected(topping.id) ? 'text-gray-400' : ''}`}>
                              Grilled
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                  )
                })}
              </div>
            </div>
            {category !== categories[categories.length - 1] && <Separator className="my-4" />}
          </div>
        ))}

        <Button type="submit" className="w-full">
          Add to Cart
        </Button>
      </form>
    </Card>
  )
} 