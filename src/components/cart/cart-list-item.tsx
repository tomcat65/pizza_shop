'use client'

import { Minus, Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useCartStore } from '@/lib/store/cart'
import { useUIStore } from '@/lib/store/ui'
import type { CartItem } from '@/lib/types/cart'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface CartListItemProps {
  item: CartItem
}

export function CartListItem({ item }: CartListItemProps) {
  const { removeFromCart, updateQuantity } = useCartStore()
  const { toggleCart } = useUIStore()
  const router = useRouter()

  // Calculate the total price for toppings
  const toppingsTotal = item.toppings?.reduce((sum, topping) => 
    sum + (Number(topping.price) || 0), 0) || 0

  // Calculate the total price for this item including base price, size adjustment, toppings, and quantity
  const itemTotal = (
    (Number(item.basePrice) + 
    Number(item.size.price_adjustment || 0) + 
    toppingsTotal) * 
    (Number(item.quantity) || 1)
  )

  const handleIncrement = () => {
    updateQuantity(item.cartId, (item.quantity || 1) + 1)
  }

  const handleDecrement = () => {
    if ((item.quantity || 1) > 1) {
      updateQuantity(item.cartId, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.cartId)
  }

  const handleEdit = () => {
    // Navigate to the pizza customization page with the current item's details
    const url = `/pizza_menu/${item.itemId}?size=${item.size.id}`
    toggleCart() // Close the cart drawer
    router.push(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{item.name}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-philly-green hover:text-white hover:bg-philly-green"
              onClick={handleEdit}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit {item.name}</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{item.size.name}</p>
          {item.toppings?.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {item.toppings.map(t => t.name).join(', ')}
            </p>
          )}
          {item.specialInstructions && (
            <p className="text-sm text-muted-foreground">
              Note: {item.specialInstructions}
            </p>
          )}
        </div>
        <p className="font-medium">{formatPrice(itemTotal)}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
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
        </div>
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
  )
} 