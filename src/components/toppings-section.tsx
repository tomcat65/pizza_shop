"use client"

import { useState, useEffect, useCallback } from "react"
import { ToppingsSelector } from "./toppings-selector"
import type { Database } from "@/lib/supabase/database.types"
import { createClient } from "@/lib/supabase/client"


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

interface ToppingsSectionProps {
  item: Item
  selectedSize: ItemSize
  onToppingsChange: (toppings: { topping: Topping; isGrilled?: boolean }[]) => void
}

type SelectedTopping = {
  topping: Topping
  isGrilled?: boolean
}

// Create a single Supabase client instance
const supabase = createClient()

export default function ToppingsSection({ item, selectedSize, onToppingsChange }: ToppingsSectionProps) {
  console.log('ToppingsSection initializing with item:', {
    id: item.id,
    name: item.name,
    category: item.category,
    available_toppings: item.available_toppings
  })

  const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [availableToppings, setAvailableToppings] = useState<AvailableTopping[]>([])
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)

  // Calculate total price whenever selected toppings or size changes
  useEffect(() => {
    const basePrice = Number(item.base_price) + Number(selectedSize.price_adjustment)
    const toppingsPrice = selectedToppings.reduce((total, { topping }) => {
      return total + (topping.price * getPriceMultiplier(selectedSize.name))
    }, 0)
    
    setTotalPrice(basePrice + toppingsPrice)
  }, [selectedToppings, selectedSize, item.base_price])

  // Notify parent of toppings changes
  useEffect(() => {
    onToppingsChange(selectedToppings)
  }, [selectedToppings, onToppingsChange])

  // Toppings initialization effect
  useEffect(() => {
    console.log('Starting toppings initialization for item:', item.id)
    let isEffectRunning = true

    async function initializeToppings() {
      try {
        setError(null)
        setErrorDetails(null)
        // First, check if we have any toppings at all
        console.log('Checking for existing toppings...')
        const { data: existingToppings, error: checkError } = await supabase
          .from('toppings')
          .select('*')
          .eq('active', true)

        if (!isEffectRunning) {
          console.log('Effect no longer running, aborting')
          return
        }
        
        if (checkError) {
          console.error('Error checking toppings:', checkError)
          setError('Failed to load toppings')
          setErrorDetails(checkError)
          return
        }

        console.log('Found existing toppings:', existingToppings?.length || 0)

        let toppingsToUse = existingToppings

        // Create default toppings if none exist
        if (!existingToppings?.length) {
          console.log('Creating default toppings...')
          const defaultToppings: Database['public']['Tables']['toppings']['Insert'][] = [
            { 
              name: 'Supremo Italiano Mozzarella', 
              price: 1.00, 
              category: 'cheese' as const, 
              active: true,
              item_type: 'both' as const,
              veggie_state: null
            },
            {
              name: 'Pepperoni',
              price: 1.50,
              category: 'meat' as const,
              active: true,
              item_type: 'both' as const,
              veggie_state: null
            },
            {
              name: 'Green Peppers',
              price: 0.75,
              category: 'veggie' as const,
              active: true,
              item_type: 'both' as const,
              veggie_state: 'both' as const
            }
          ]

          console.log('Attempting to insert toppings with data:', defaultToppings)
          const { data: createdToppings, error: insertError } = await supabase
            .from('toppings')
            .insert(defaultToppings)
            .select()

          if (insertError) {
            console.error('Error creating default toppings:', insertError)
            setError('Failed to create default toppings')
            setErrorDetails(insertError)
            return
          }

          toppingsToUse = createdToppings
          console.log('Created default toppings:', createdToppings)
        }

        if (!toppingsToUse?.length) {
          console.error('No toppings available after initialization')
          setError('No toppings available')
          return
        }

        // Check for existing available toppings for this item
        console.log('Checking available toppings for item:', item.id)
        const { data: itemAvailableToppings, error: availableError } = await supabase
          .from('item_available_toppings')
          .select(`
            id,
            item_id,
            topping_id,
            is_grilled,
            topping:toppings(*)
          `)
          .eq('item_id', item.id)

        if (!isEffectRunning) {
          console.log('Effect no longer running, aborting')
          return
        }

        if (availableError) {
          console.error('Error checking available toppings:', availableError)
          setError('Failed to load available toppings')
          setErrorDetails(availableError)
          return
        }

        // Create available toppings if none exist
        if (!itemAvailableToppings?.length) {
          console.log('Creating available toppings for item:', item.id)
          const availableToppingsToInsert: Database['public']['Tables']['item_available_toppings']['Insert'][] = toppingsToUse.map(topping => ({
            item_id: item.id,
            topping_id: topping.id,
            is_grilled: null
          }))

          console.log('Attempting to insert available toppings:', availableToppingsToInsert)
          const { data: insertedData, error: insertError } = await supabase
            .from('item_available_toppings')
            .insert(availableToppingsToInsert)
            .select(`
              id,
              item_id,
              topping_id,
              is_grilled,
              topping:toppings(*)
            `)

          if (insertError) {
            console.error('Error creating available toppings:', insertError)
            setError('Failed to create available toppings')
            setErrorDetails(insertError)
            return
          }

          console.log('Created available toppings:', insertedData)
          if (isEffectRunning) {
            setAvailableToppings(insertedData.map(data => ({ topping: data.topping })))
          }
        } else {
          console.log('Using existing available toppings:', itemAvailableToppings)
          if (isEffectRunning) {
            setAvailableToppings(itemAvailableToppings.map(data => ({ topping: data.topping })))
          }
        }
      } catch (error) {
        console.error('Error initializing toppings:', error)
        setError('An unexpected error occurred')
        setErrorDetails(error)
      } finally {
        if (isEffectRunning) {
          setIsLoading(false)
        }
      }
    }

    initializeToppings()

    return () => {
      console.log('Cleaning up toppings initialization effect')
      isEffectRunning = false
    }
  }, [item.id])

  // Price multiplier based on size
  const getPriceMultiplier = (size: string) => {
    switch (size) {
      case 'Personal (10")':
        return 0.85
      case 'Family (17")':
        return 1.6
      default: // Regular (12")
        return 1
    }
  }

  if (error) {
    return (
      <div className="mt-8 text-center">
        <div className="text-red-600 mb-2">
          {error}. Please try refreshing the page.
        </div>
        {errorDetails && (
          <pre className="text-left text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(errorDetails, null, 2)}
          </pre>
        )}
      </div>
    )
  }
  
  if (isLoading) {
    return <div className="mt-8 text-center">Loading toppings...</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Customize Your {item.name}</h2>
      
      {/* Price Display */}
      <div className="mb-4 text-lg">
        <span className="font-medium">Total Price: </span>
        <span className="text-orange-600 font-semibold">
          ${totalPrice.toFixed(2)}
        </span>
        {selectedToppings.length > 0 && (
          <div className="text-sm text-gray-600 mt-1">
            Includes {selectedToppings.length} topping{selectedToppings.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <ToppingsSelector
        toppings={availableToppings.map(at => at.topping)}
        itemType={item.category.name.toLowerCase() as "pizza" | "cheesesteak"}
        size={selectedSize.name as "Personal (10\")" | "Regular (12\")" | "Family (17\")"}
        onToppingsChange={setSelectedToppings}
      />
    </div>
  )
} 