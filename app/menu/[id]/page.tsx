import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"
import { MenuItemContent } from "@/components/menu-item-content"

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

type ItemSize = Database['public']['Tables']['item_sizes']['Row']
type Topping = Database['public']['Tables']['toppings']['Row']
type AvailableTopping = {
  topping: Topping
}
type Item = Database['public']['Tables']['items']['Row'] & {
  sizes: ItemSize[]
  category: { name: string }
  available_toppings: AvailableTopping[]
}

interface Props {
  params: Promise<{ id: string }> | { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function MenuItemPage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const id = resolvedParams.id

  if (!id) {
    console.error('No item ID provided')
    notFound()
  }

  console.log('Page params:', { id })
  console.log('Search params:', searchParams)

  const supabase = createClient()
  
  async function getItemDetails(itemId: string) {
    console.log('Fetching item details for ID:', itemId)
    
    try {
      // First, get the base item
      const { data: item, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single()

      if (itemError) {
        console.error('Error fetching base item:', itemError)
        throw new Error(`Error fetching base item: ${JSON.stringify(itemError)}`)
      }

      if (!item) {
        console.error('Item not found')
        notFound()
      }

      console.log('Found base item:', item)

      // Then get the sizes
      const { data: sizes, error: sizesError } = await supabase
        .from('item_sizes')
        .select('*')
        .eq('item_id', itemId)
        .order('price_adjustment')

      if (sizesError) {
        console.error('Error fetching sizes:', sizesError)
        throw new Error(`Error fetching sizes: ${JSON.stringify(sizesError)}`)
      }

      if (!sizes?.length) {
        console.error('No sizes found for item')
        throw new Error('No sizes found for item')
      }

      console.log('Found sizes:', sizes)

      // Get the category
      const { data: category, error: categoryError } = item.category_id 
        ? await supabase
            .from('categories')
            .select('name')
            .eq('id', item.category_id)
            .single()
        : { data: { name: 'Uncategorized' }, error: null }

      if (categoryError) {
        console.error('Error fetching category:', categoryError)
        throw new Error(`Error fetching category: ${JSON.stringify(categoryError)}`)
      }

      console.log('Found category:', category)

      // Get available toppings with detailed error logging
      console.log('Fetching available toppings for item:', itemId)
      const { data: availableToppings, error: toppingsError } = await supabase
        .from('item_available_toppings')
        .select(`
          id,
          is_grilled,
          topping:toppings(
            id,
            name,
            category,
            price,
            active,
            item_type,
            veggie_state
          )
        `)
        .eq('item_id', itemId)

      if (toppingsError) {
        console.error('Error fetching toppings:', toppingsError)
        throw new Error(`Error fetching toppings: ${JSON.stringify(toppingsError)}`)
      }

      // Filter out null toppings and inactive toppings
      const filteredToppings = availableToppings?.filter(at => at.topping && at.topping.active) || []
      console.log('Found available toppings:', filteredToppings)

      const fullItem = {
        ...item,
        sizes,
        category,
        available_toppings: filteredToppings.map(at => ({
          topping: at.topping
        }))
      }

      console.log('Assembled full item:', fullItem)
      return fullItem as Item
    } catch (error) {
      console.error('Error in getItemDetails:', error)
      throw error
    }
  }
  
  try {
    const item = await getItemDetails(id)
    
    if (!item) {
      console.error('Item not found or error fetching item')
      notFound()
    }

    // If no size is selected, use the first available size
    const selectedSize = searchParams?.size 
      ? item.sizes.find((size: ItemSize) => size.id === searchParams.size)
      : item.sizes[0]
    
    if (!selectedSize) {
      console.error('No valid size found for item')
      notFound()
    }

    console.log('Selected size:', selectedSize)
    return <MenuItemContent item={item} selectedSize={selectedSize} />
  } catch (error) {
    console.error('Error rendering menu item page:', error)
    throw error
  }
} 