import type { Database } from '../supabase/database.types'

export type DatabaseTopping = Database['public']['Tables']['toppings']['Row']

export interface Topping {
  id: string
  name: string
  price: number
  category: string
  active: boolean
  created_at: string
  isGrilled?: boolean
  veggie_state?: 'grilled' | 'natural' | 'both'
}

export interface CartItem {
  cartId: string  // Unique identifier for cart items
  itemId: string
  name: string
  basePrice: number
  size: {
    id: string
    name: string
    price_adjustment: number
  }
  quantity: number
  toppings: Array<{
    id: string
    name: string
    price: number
    isGrilled?: boolean
  }>
  specialInstructions?: string
  crustType?: 'thin' | 'regular' | 'thick'
}

export interface CartState {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  toggleCart: () => void
  getTotalPrice: () => number
} 