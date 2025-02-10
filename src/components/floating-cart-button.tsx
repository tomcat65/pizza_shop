'use client'

import { useCartStore } from '@/lib/store/cart'
import { useUIStore } from '@/lib/store/ui'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FloatingCartButton() {
  const items = useCartStore((state) => state.items)
  const { toggleCart } = useUIStore()

  return (
    <Button
      onClick={toggleCart}
      className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
      size="icon"
    >
      <ShoppingCart className="h-6 w-6" />
      {items.length > 0 && (
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-philly-red text-xs font-bold text-white">
          {items.length}
        </span>
      )}
    </Button>
  )
} 