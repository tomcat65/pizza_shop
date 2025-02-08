"use client"

import { useEffect, useState } from "react"
import type { Database } from "@/lib/supabase/database.types"
import ToppingsSection from "./toppings-section"

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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

          {/* Loading State */}
          <div className="mt-8 text-center">
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
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
        <ToppingsSection item={item} selectedSize={selectedSize} />

        {/* Add to Cart Button */}
        <div className="mt-8 sticky bottom-4">
          <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
} 