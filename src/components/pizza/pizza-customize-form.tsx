"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { DatabaseTopping } from '@/lib/types/cart'

interface PizzaCustomizeFormProps {
  toppings: DatabaseTopping[]
  defaultToppingIds: string[]
  itemType: "pizza" | "cheesesteak"
  size: "Personal (10\")" | "Regular (12\")" | "Family (17\")"
  itemName: string
  onAddToCart: (selectedToppings: Array<{ topping: DatabaseTopping; isGrilled?: boolean }>) => void
}

export function PizzaCustomizeForm({
  toppings,
  defaultToppingIds,
  itemType,
  size,
  itemName,
  onAddToCart
}: PizzaCustomizeFormProps) {
  const [selectedToppings, setSelectedToppings] = useState<Array<{ topping: DatabaseTopping; isGrilled?: boolean }>>([])

  const handleToppingToggle = (topping: DatabaseTopping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.topping.id === topping.id)
      if (exists) {
        return prev.filter(t => t.topping.id !== topping.id)
      }
      return [...prev, { topping }]
    })
  }

  const getToppingLabel = (topping: DatabaseTopping) => {
    const isDefault = defaultToppingIds.includes(topping.id)
    const isSelected = selectedToppings.some(t => t.topping.id === topping.id)
    if (isDefault && isSelected) {
      return `XTRA-${topping.name}`
    }
    return topping.name
  }

  const groupedToppings = toppings.reduce<Record<string, DatabaseTopping[]>>((acc, topping) => {
    const category = topping.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(topping)
    return acc
  }, {})

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customize Your {itemName}</h2>
      <p className="text-gray-600 mb-4">Size: {size}</p>

      <div className="space-y-6">
        {Object.entries(groupedToppings).map(([category, categoryToppings]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold capitalize mb-2">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryToppings.map((topping) => {
                const isSelected = selectedToppings.some(t => t.topping.id === topping.id)
                return (
                  <div key={topping.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={topping.id}
                      checked={isSelected}
                      onChange={() => handleToppingToggle(topping)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={topping.id} className="flex-1">
                      {getToppingLabel(topping)}
                      <span className="text-sm text-gray-500 ml-1">
                        (+${topping.price.toFixed(2)})
                      </span>
                    </Label>
                  </div>
                )
              })}
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          onClick={() => onAddToCart(selectedToppings)}
          className="w-full"
          size="lg"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  )
} 