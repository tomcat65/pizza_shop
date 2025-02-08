"use client"

import { useState } from "react"
import type { Database } from "@/lib/supabase/database.types"
import Link from "next/link"

type ToppingCategory = 'cheese' | 'meat' | 'veggie'
type Topping = Database["public"]["Tables"]["toppings"]["Row"]

interface ToppingsSelectorProps {
  toppings: Topping[]
  itemType: "pizza" | "cheesesteak"
  size: "Personal (10\")" | "Regular (12\")" | "Family (17\")"
  onToppingsChange: (selectedToppings: Array<{ topping: Topping; isGrilled?: boolean }>) => void
}

export default function ToppingsSelector({
  toppings,
  itemType,
  size,
  onToppingsChange,
}: ToppingsSelectorProps) {
  const [selectedToppings, setSelectedToppings] = useState<
    Array<{ topping: Topping; isGrilled?: boolean }>
  >([])

  const getPriceMultiplier = (size: string) => {
    switch (size) {
      case 'Personal (10")':
        return 0.85
      case 'Family (17")':
        return 1.60
      default:
        return 1
    }
  }

  const priceMultiplier = getPriceMultiplier(size)

  const handleToppingToggle = (topping: Topping, isGrilled?: boolean) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.topping.id === topping.id)
      if (exists) {
        const filtered = prev.filter((t) => t.topping.id !== topping.id)
        onToppingsChange(filtered)
        return filtered
      }
      const newToppings = [...prev, { topping, isGrilled }]
      onToppingsChange(newToppings)
      return newToppings
    })
  }

  const groupedToppings = toppings.reduce(
    (acc, topping) => {
      if (topping.item_type !== itemType && topping.item_type !== "both") return acc
      acc[topping.category].push(topping)
      return acc
    },
    { cheese: [], meat: [], veggie: [] } as Record<ToppingCategory, Topping[]>
  )

  return (
    <div className="space-y-6">
      {/* Cheese Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-semibold">Cheese</h3>
        <div className="space-y-2">
          {groupedToppings.cheese.map((topping) => (
            <label
              key={topping.id}
              className="flex items-center justify-between hover:bg-orange-50 p-2 rounded cursor-pointer"
            >
              <span>{topping.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-orange-600">
                  ${(topping.price * priceMultiplier).toFixed(2)}
                </span>
                <input
                  type="checkbox"
                  checked={selectedToppings.some((t) => t.topping.id === topping.id)}
                  onChange={() => handleToppingToggle(topping)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Meat Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-semibold">Meat</h3>
        <div className="space-y-2">
          {groupedToppings.meat.map((topping) => (
            <label
              key={topping.id}
              className="flex items-center justify-between hover:bg-orange-50 p-2 rounded cursor-pointer"
            >
              <span>{topping.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-orange-600">
                  ${(topping.price * priceMultiplier).toFixed(2)}
                </span>
                <input
                  type="checkbox"
                  checked={selectedToppings.some((t) => t.topping.id === topping.id)}
                  onChange={() => handleToppingToggle(topping)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Veggies Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-semibold">Veggies</h3>
        <div className="space-y-2">
          {groupedToppings.veggie.map((topping) => (
            <div key={topping.id} className="flex items-center justify-between hover:bg-orange-50 p-2 rounded">
              <span>{topping.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-orange-600">
                  ${(topping.price * priceMultiplier).toFixed(2)}
                </span>
                {topping.veggie_state === 'both' ? (
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`veggie-${topping.id}`}
                        checked={selectedToppings.some(
                          (t) => t.topping.id === topping.id && t.isGrilled === true
                        )}
                        onChange={() => handleToppingToggle(topping, true)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      Grilled
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`veggie-${topping.id}`}
                        checked={selectedToppings.some(
                          (t) => t.topping.id === topping.id && t.isGrilled === false
                        )}
                        onChange={() => handleToppingToggle(topping, false)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      Fresh
                    </label>
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedToppings.some((t) => t.topping.id === topping.id)}
                    onChange={() => handleToppingToggle(topping)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 