'use client'

import type { Database } from "@/lib/supabase/database.types"
import { PizzaCustomizeForm } from "./pizza-customize-form"
import { useCartStore } from "@/lib/store/cart"
import { useUIStore } from "@/lib/store/ui"
import { toast } from "sonner"
import { MainNav } from "@/components/layout/nav"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { DatabaseTopping } from '@/lib/types/cart'

interface PizzaCustomizeWrapperProps {
  toppings: DatabaseTopping[]
  defaultToppingIds: string[]
  itemType: "pizza" | "cheesesteak"
  size: "Personal (10\")" | "Regular (12\")" | "Family (17\")"
  itemName: string
  itemId: string
  basePrice: number
}

export default function PizzaCustomizeWrapper({
  toppings,
  defaultToppingIds,
  itemType,
  size,
  itemName,
  itemId,
  basePrice
}: PizzaCustomizeWrapperProps) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const { toggleCart } = useUIStore()

  const handleAddToCart = (selectedToppings: Array<{ topping: DatabaseTopping; isGrilled?: boolean }>) => {
    addItem({
      itemId,
      name: itemName,
      size,
      basePrice,
      toppings: selectedToppings.map(({ topping }) => ({
        id: topping.id,
        name: defaultToppingIds.includes(topping.id) ? `XTRA-${topping.name}` : topping.name,
        price: topping.price,
        category: topping.category,
        active: true,
        created_at: topping.created_at
      })),
      quantity: 1,
      specialInstructions: '',
      crustType: 'regular'
    })

    toast.success('Added to cart!', {
      description: `${itemName} - ${size} has been added to your cart.`,
      duration: 3000
    })

    toggleCart()
  }

  const handleCartClick = () => {
    toggleCart()
    if (items.length > 0) {
      toast.message(`${items.length} item${items.length === 1 ? '' : 's'} in cart`, {
        className: "philly-toast",
        style: {
          backgroundColor: "#004C54",
          color: "white",
          border: "none",
        },
        position: "bottom-center",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        <PizzaCustomizeForm 
          toppings={toppings}
          defaultToppingIds={defaultToppingIds}
          itemType={itemType}
          size={size}
          itemName={itemName}
          onAddToCart={handleAddToCart}
        />
      </main>
      
      {/* Floating Cart Button */}
      <Button
        onClick={handleCartClick}
        className="fixed right-4 bottom-4 z-50 rounded-full p-4 shadow-lg"
        size="icon"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-philly-red text-xs font-bold text-white">
            {items.length}
          </span>
        )}
      </Button>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  )
} 