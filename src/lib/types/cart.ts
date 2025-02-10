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
  id: string
  itemId: string
  name: string
  size: string
  basePrice: number
  toppings: Topping[]
  quantity: number
  specialInstructions?: string
  crustType: string
  createdAt: string
}

export interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
} 