"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"
import { MainNav } from "@/components/layout/nav"
import { BackButton } from "@/components/layout/back-button"
import Link from "next/link"

type ItemSize = Database['public']['Tables']['item_sizes']['Row']
type Item = Database['public']['Tables']['items']['Row']

export default function PizzaMenuPage() {
  const [pizzaItems, setPizzaItems] = useState<Item[]>([])
  const [itemSizes, setItemSizes] = useState<Record<string, ItemSize[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all pizza items
        const { data: pizzaData, error: pizzaError } = await supabase
          .from('items')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('active', true)
          .eq('categories.name', 'Pizza')
          .order('name')

        if (pizzaError) {
          console.error('Error fetching pizzas:', pizzaError)
          throw new Error('Failed to load menu data')
        }
        
        setPizzaItems(pizzaData || [])
        console.log('Found pizzas:', pizzaData)

        // Fetch sizes for all pizza items
        if (pizzaData?.length) {
          const pizzaIds = pizzaData.map(pizza => pizza.id)
          const { data: sizesData, error: sizesError } = await supabase
            .from('item_sizes')
            .select('*')
            .in('item_id', pizzaIds)
            .order('price_adjustment')

          if (sizesError) {
            console.error('Error fetching sizes:', sizesError)
            throw new Error('Failed to load menu data')
          }

          // Group sizes by item_id
          const sizesByItem = sizesData?.reduce((acc, size) => {
            if (!acc[size.item_id]) {
              acc[size.item_id] = []
            }
            acc[size.item_id].push(size)
            return acc
          }, {} as Record<string, ItemSize[]>)

          setItemSizes(sizesByItem || {})
          console.log('Found sizes:', sizesByItem)
        }

      } catch (err) {
        console.error('Error in loadData:', err)
        setError('Failed to load menu data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [supabase])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <BackButton />
            </div>
            <div className="text-center text-red-600">
              {error}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <BackButton />
            </div>
            <div className="text-center">
              Loading pizza menu...
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 philly-text-gradient">
              Our Pizza Menu
            </h1>
            <p className="text-gray-600">
              Select your pizza and customize it with your favorite toppings.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pizzaItems.map((pizza) => (
              <div key={pizza.id} className="philly-card overflow-hidden">
                {/* Pizza Image */}
                {pizza.image_url && (
                  <div className="aspect-video w-full overflow-hidden bg-philly-silver-100">
                    <img
                      src={pizza.image_url}
                      alt={pizza.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}

                {/* Pizza Info */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-philly-green-800">
                    {pizza.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {pizza.description}
                  </p>

                  {/* Size Options */}
                  <div className="space-y-3">
                    {itemSizes[pizza.id]?.map((size) => {
                      const totalPrice = pizza.base_price + (size.price_adjustment ?? 0)
                      
                      return (
                        <Link
                          key={size.id}
                          href={`/pizza_menu/${pizza.id}?size=${size.id}`}
                          className="block p-3 rounded-lg border border-gray-200 hover:border-philly-green hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{size.name}</span>
                            <span className="text-lg font-bold text-philly-green">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {size.name.includes('Personal') ? 'Perfect for 1-2 people' :
                             size.name.includes('Regular') ? 'Perfect for 2-3 people' :
                             'Perfect for 4-5 people'}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 