'use client'

import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { useCartStore } from '@/lib/store/cart'
import { useUIStore } from '@/lib/store/ui'
import { CartListItem } from './cart-list-item'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { cartItems, getTotalPrice } = useCartStore()
  const { isOpen, toggleCart } = useUIStore()
  const totalItems = cartItems?.length || 0
  const totalPrice = getTotalPrice()

  const handleContinueShopping = () => {
    toggleCart()
  }

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
          </SheetTitle>
        </SheetHeader>
        
        {totalItems === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <span className="text-xl font-medium text-muted-foreground">Your cart is empty</span>
            <Button 
              variant="outline" 
              onClick={handleContinueShopping}
              className="mt-4 border-2 border-philly-green text-philly-green hover:bg-philly-green hover:text-white transition-all duration-200"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <CartListItem key={item.cartId} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="border-t pr-6">
              <div className="flex items-center justify-between py-4">
                <span className="text-base font-medium">Total</span>
                <span className="text-lg font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleContinueShopping}
                  className="w-full border-2 border-philly-green bg-white text-philly-green hover:bg-philly-green hover:text-white transition-all duration-200 hover:scale-105"
                >
                  Continue Shopping
                </Button>
                <Button 
                  className="w-full bg-philly-green text-white hover:bg-white hover:text-philly-green hover:border-2 hover:border-philly-green transition-all duration-200 hover:scale-105"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
} 