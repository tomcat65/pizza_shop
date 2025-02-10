'use client'

import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { CartList } from './cart-list'
import { useCartStore } from '@/lib/store/cart'
import { useUIStore } from '@/lib/store/ui'
import { CartItem } from '@/lib/types/cart'

export function CartDrawer() {
  const cartItems = useCartStore((state) => state.items)
  const { isCartOpen, closeCart } = useUIStore()
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
          </SheetTitle>
        </SheetHeader>
        <CartList />
      </SheetContent>
    </Sheet>
  )
} 