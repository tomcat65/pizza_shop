'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useCartStore } from '@/lib/store/cart'
import type { CartItem } from '@/lib/types/cart'

interface CartListItemProps {
  item: CartItem
}

export function CartListItem({ item }: CartListItemProps) {
  const { removeItem, updateQuantity } = useCartStore()
  const itemTotal = (item.basePrice + item.toppings.reduce((sum, topping) => sum + topping.price, 0)) * item.quantity

  const handleIncrement = () => {
    updateQuantity(item.itemId, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.itemId, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeItem(item.itemId)
  }

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      <div className="flex-1">
        <h3 className="font-medium">{item.name} - {item.size}</h3>
        <div className="mt-1 text-sm text-muted-foreground">
          {item.toppings.length > 0 ? (
            <p>Toppings: {item.toppings.map(t => t.name).join(', ')}</p>
          ) : (
            <p>No extra toppings</p>
          )}
          {item.specialInstructions && (
            <p className="mt-1">Note: {item.specialInstructions}</p>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">${itemTotal.toFixed(2)}</p>
      </div>
    </div>
  )
} 