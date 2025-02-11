'use client'

import type { Database } from "@/lib/supabase/database.types"
import PizzaCustomizeForm from "./pizza-customize-form"
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
  defaultToppingIds: Array<{ id: string; isGrilled: boolean | null }>
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
          itemId={itemId}
          basePrice={basePrice}
        />
      </main>     
    </div>
  )
} 