import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"
import PizzaCustomizeWrapper from "@/components/pizza/pizza-customize-wrapper"
import { Topping } from "@/lib/types/cart"

type ItemSize = Database['public']['Tables']['item_sizes']['Row']
type DatabaseTopping = Database['public']['Tables']['toppings']['Row']
type DatabaseItem = Database['public']['Tables']['items']['Row']
type ItemAvailableTopping = Database['public']['Tables']['item_available_toppings']['Row'] & {
  topping: DatabaseTopping
}

type Item = Omit<DatabaseItem, 'active'> & {
  active: boolean
  category: { name: string }
  sizes: ItemSize[]
  available_toppings: ItemAvailableTopping[]
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ size?: string }>
}

export default async function PizzaCustomizePage({ 
  params,
  searchParams 
}: PageProps) {
  const supabase = createClient()
  const { id } = await params
  const { size: selectedSizeId } = await searchParams

  // Fetch the pizza item with its default toppings
  const { data: item, error: itemError } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('id', id)
    .single()

  if (itemError || !item || !item.category) {
    console.error('Error fetching item:', itemError)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-red-600">Error</h1>
            <p className="mt-2">Failed to load pizza details. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch sizes for this item
  const { data: rawSizes = [], error: sizesError } = await supabase
    .from('item_sizes')
    .select('*')
    .eq('item_id', id)

  if (sizesError) {
    console.error('Error fetching sizes:', sizesError)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-red-600">Error</h1>
            <p className="mt-2">Failed to load pizza sizes. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  // Ensure sizes is not null
  const sizes = rawSizes ?? []

  // Find the selected size from the URL parameter
  const selectedSize = sizes.find(size => size.id === selectedSizeId) || sizes[0]

  // Fetch all active toppings and default toppings for this item
  const [toppingsResult, defaultToppingsResult] = await Promise.all([
    supabase
      .from('toppings')
      .select('*')
      .eq('active', true)
      .in('item_type', ['pizza', 'both']),
    supabase
      .from('item_available_toppings')
      .select(`
        *,
        topping:toppings(*)
      `)
      .eq('item_id', id)
      .eq('is_default', true)
  ])

  if (toppingsResult.error) {
    console.error('Error fetching toppings:', toppingsResult.error)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-red-600">Error</h1>
            <p className="mt-2">Failed to load toppings. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  if (defaultToppingsResult.error) {
    console.error('Error fetching default toppings:', defaultToppingsResult.error)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-red-600">Error</h1>
            <p className="mt-2">Failed to load default toppings. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  // Ensure toppings is not null and filter active ones
  const toppings = toppingsResult.data ?? []
  const activeToppings = toppings
    .filter((topping): topping is DatabaseTopping => 
      topping.active === true && 
      typeof topping.name === 'string' &&
      typeof topping.price === 'number' &&
      typeof topping.category === 'string'
    )

  // Get the default toppings
  const defaultToppingIds = (defaultToppingsResult.data ?? [])
    .map(dt => ({
      id: dt.topping.id,
      isGrilled: dt.is_grilled
    }))

  return (
    <PizzaCustomizeWrapper 
      toppings={activeToppings}
      defaultToppingIds={defaultToppingIds}
      itemType="pizza"
      size={selectedSize.name as "Personal (10\")" | "Regular (12\")" | "Family (17\")"}
      itemName={item.name}
      itemId={item.id}
      basePrice={item.base_price}
    />
  )
} 