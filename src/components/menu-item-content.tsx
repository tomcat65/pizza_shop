"use client"

import { useEffect, useState } from "react"
import type { Database } from "@/lib/supabase/database.types"
import ToppingsSection from "./toppings-section"
import { useCartStore } from "@/lib/store/cart"
import { useUIStore } from "@/lib/store/ui"
import { toast } from "sonner"
import { BackButton } from "@/components/layout/back-button"
import { MainNav } from "@/components/layout/nav"
import { ShoppingCart } from "lucide-react"

type ItemSize = Database['public']['Tables']['item_sizes']['Row']
type Item = Database['public']['Tables']['items']['Row'] & {
  sizes: ItemSize[]
  category: { name: string }
  available_toppings: any[]
}

interface MenuItemContentProps {
  item: Item
  selectedSize: ItemSize
}

export function MenuItemContent({ item, selectedSize }: MenuItemContentProps) {
  const [isClient, setIsClient] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState<any[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const { toggleCart } = useUIStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = () => {
    addItem({
      itemId: item.id,
      name: item.name,
      size: selectedSize,
      basePrice: item.base_price,
      toppings: selectedToppings,
      quantity: 1,
      specialInstructions
    })
    toast.success("Added to cart!", {
      className: "philly-toast",
      style: {
        backgroundColor: "#004C54",
        color: "white",
        border: "none",
      },
      position: "bottom-center",
    })
  }

  if (!isClient) {
    return (
      <div className="min-h-screen">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Loading State */}
            <div className="mt-8 text-center">
              Loading...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Item Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-2">
              <span className="text-lg font-semibold text-orange-600">
                ${(Number(item.base_price) + Number(selectedSize.price_adjustment)).toFixed(2)}
              </span>
              <span className="ml-2 text-gray-600">• {selectedSize.name}</span>
            </div>
          </div>

          {/* Item Image */}
          {item.image_url && (
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Toppings Section */}
          <ToppingsSection 
            item={item} 
            selectedSize={selectedSize} 
            onToppingsChange={setSelectedToppings}
          />

          {/* Special Instructions */}
          <div className="mt-8">
            <label htmlFor="special-instructions" className="block text-sm font-medium text-gray-700">
              Special Instructions
            </label>
            <textarea
              id="special-instructions"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Any special requests? (Optional)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          {/* Add to Cart Button */}
          <div className="mt-8 sticky bottom-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Floating Cart Button */}
          <button
            onClick={toggleCart}
            className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-philly-green text-white shadow-lg hover:bg-philly-green-600 focus:outline-none focus:ring-2 focus:ring-philly-green-400 focus:ring-offset-2"
          >
            <ShoppingCart className="h-6 w-6" />
            {items.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-philly-red text-sm font-bold">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 