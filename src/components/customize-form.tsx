"use client"

import ToppingsSelector from "./toppings-selector"
import type { Database } from "@/lib/supabase/database.types"
import { useState } from "react"

type Topping = Database["public"]["Tables"]["toppings"]["Row"]

interface CustomizeFormProps {
  toppings: Topping[]
  itemType: "pizza" | "cheesesteak"
  size: "Personal (10\")" | "Regular (12\")" | "Family (17\")"
  itemName: string
  onAddToCart: (selectedToppings: Array<{ topping: Topping; isGrilled?: boolean }>) => void
}

export default function CustomizeForm({
  toppings,
  itemType,
  size,
  itemName,
  onAddToCart
}: CustomizeFormProps) {
  const [selectedToppings, setSelectedToppings] = useState<Array<{ topping: Topping; isGrilled?: boolean }>>([])

  const handleToppingsChange = (newToppings: Array<{ topping: Topping; isGrilled?: boolean }>) => {
    setSelectedToppings(newToppings)
    console.log("Selected toppings:", newToppings)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customize Your {itemName}</h2>
      <ToppingsSelector
        toppings={toppings}
        itemType={itemType}
        size={size}
        onToppingsChange={handleToppingsChange}
      />

      <div className="mt-8 sticky bottom-4">
        <button 
          onClick={() => onAddToCart(selectedToppings)} 
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
} 