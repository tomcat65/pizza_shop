"use client"

import { useEffect, useState } from "react"
import type { Database } from "@/lib/supabase/database.types"
import ToppingsSection from "@/components/toppings-section"
import { useCartStore } from "@/lib/store/cart"
import { useUIStore } from "@/lib/store/ui"
import { toast } from "sonner"
import { BackButton } from "@/components/layout/back-button"
import { MainNav } from "@/components/layout/nav"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingCartButton } from '@/components/floating-cart-button'

type ItemSize = Database['public']['Tables']['item_sizes']['Row']
type AvailableTopping = {
  topping: Database['public']['Tables']['toppings']['Row']
}
type Item = Database['public']['Tables']['items']['Row'] & {
  category: { name: string }
  sizes: ItemSize[]
  available_toppings: AvailableTopping[]
}

type CrustType = 'thin' | 'regular' | 'thick'

interface PizzaItemContentProps {
  item: Item
  sizes: ItemSize[]
  toppings: Database['public']['Tables']['toppings']['Row'][]
}

export function PizzaItemContent({ item, sizes, toppings }: PizzaItemContentProps) {
  const [isClient, setIsClient] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState<any[]>([])
  const [selectedSize, setSelectedSize] = useState<ItemSize>(sizes[0])
  const [crustType, setCrustType] = useState<CrustType>('regular')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const { addItem } = useCartStore()
  const { toggleCart } = useUIStore()
  const items = useCartStore((state) => state.items)

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
      crustType,
      specialInstructions,
      quantity: 1
    })

    toast.success('Added to cart!', {
      description: `${item.name} - ${selectedSize.name} has been added to your cart.`,
      duration: 3000
    })

    toggleCart()
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Pizza Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 philly-text-gradient">
              {item.name} - {selectedSize.name}
            </h1>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-2">
              <span className="text-lg font-semibold text-philly-green">
                ${(Number(item.base_price) + Number(selectedSize.price_adjustment)).toFixed(2)}
              </span>
              <span className="ml-2 text-gray-600">• {selectedSize.name}</span>
            </div>
          </div>

          {/* Pizza Image */}
          {item.image_url && (
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Size Selection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSize.id === size.id
                      ? 'border-philly-green bg-philly-green/10'
                      : 'border-gray-200 hover:border-philly-green/50'
                  }`}
                >
                  <div className="font-semibold">{size.name}</div>
                  <div className="text-sm text-gray-600">
                    ${(Number(item.base_price) + Number(size.price_adjustment)).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Crust Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Crust Selection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['regular', 'thin', 'thick'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCrustType(type as CrustType)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    crustType === type
                      ? 'border-philly-green bg-philly-green/10'
                      : 'border-gray-200 hover:border-philly-green/50'
                  }`}
                >
                  <div className="font-semibold capitalize">{type} Crust</div>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Section */}
          <ToppingsSection 
            item={item} 
            selectedSize={selectedSize}
            onToppingsChange={setSelectedToppings}
          />

          {/* Special Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special instructions? (Optional)"
              className="w-full p-3 border rounded-lg"
              rows={3}
            />
          </div>

          {/* Total and Add to Cart */}
          <div className="sticky bottom-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-philly-green">
                ${(Number(item.base_price) + Number(selectedSize.price_adjustment)).toFixed(2)}
              </span>
            </div>
            <Button onClick={handleAddToCart} size="lg">
              Add to Cart
            </Button>
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