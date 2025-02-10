'use client'

import { useCartStore } from '@/lib/store/cart'
import { ScrollArea } from '../ui/scroll-area'
import { CartListItem } from './cart-list-item'
import { Button } from '../ui/button'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'

export function CartList() {
  const items = useCartStore((state) => state.items)
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.basePrice + item.toppings.reduce((sum, topping) => sum + topping.price, 0)
    return acc + (itemTotal * item.quantity)
  }, 0)

  if (items.length === 0) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border-2 border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add items to your cart to see them here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[450px] flex-col">
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {items.map((item, index) => (
            <CartListItem key={`${item.itemId}-${index}`} item={item} />
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">{formatPrice(totalPrice)}</span>
        </div>
        <Button className="w-full" size="lg">
          Checkout
        </Button>
      </div>
    </div>
  )
} 