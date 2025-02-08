import { create, type StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Database } from '@/lib/supabase/database.types'

type ItemSize = Database['public']['Tables']['item_sizes']['Row']
type Topping = Database['public']['Tables']['toppings']['Row']

interface CartTopping {
  topping: Topping
  isGrilled?: boolean
}

interface CartItem {
  id: string
  itemId: string
  name: string
  size: ItemSize
  basePrice: number
  toppings: CartTopping[]
  quantity: number
  specialInstructions?: string
  createdAt: string
}

interface CartState {
  items: CartItem[]
  discountType?: 'veteran' | 'firstResponder' | 'teacher' | 'mallEmployee' | 'custom'
  discountPercent?: number
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  updateItemToppings: (itemId: string, toppings: CartTopping[]) => void
  updateItemInstructions: (itemId: string, instructions: string) => void
  setDiscount: (type?: CartState['discountType'], percent?: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTotal: () => number
}

type CartStore = CartState & CartActions

type PersistCartStore = StateCreator<
  CartStore,
  [["zustand/persist", unknown]],
  [],
  CartStore
>

export const useCartStore = create<CartStore>()(
  persist(
    ((set, get): CartStore => ({
      items: [],
      
      addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => set((state: CartState) => ({
        items: [...state.items, {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }]
      })),

      removeItem: (itemId: string) => set((state: CartState) => ({
        items: state.items.filter((item) => item.id !== itemId)
      })),

      updateItemQuantity: (itemId: string, quantity: number) => set((state: CartState) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      })),

      updateItemToppings: (itemId: string, toppings: CartTopping[]) => set((state: CartState) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, toppings } : item
        )
      })),

      updateItemInstructions: (itemId: string, instructions: string) => set((state: CartState) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, specialInstructions: instructions } : item
        )
      })),

      setDiscount: (type?: CartState['discountType'], percent?: number) => set(() => ({
        discountType: type,
        discountPercent: percent
      })),

      clearCart: () => set(() => ({
        items: [],
        discountType: undefined,
        discountPercent: undefined
      })),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          // Calculate base price with size adjustment
          let itemTotal = (item.basePrice + (item.size.price_adjustment ?? 0)) * item.quantity

          // Add topping prices
          itemTotal += item.toppings.reduce((toppingTotal, { topping }) => {
            // Apply size-based multiplier for toppings
            const multiplier = (() => {
              switch (item.size.name) {
                case 'Personal (10")': return 0.85
                case 'Family (17")': return 1.6
                default: return 1 // Regular (12")
              }
            })()
            return toppingTotal + (topping.price * multiplier)
          }, 0) * item.quantity

          return total + itemTotal
        }, 0)
      },

      getTotal: () => {
        const { getSubtotal, discountPercent } = get()
        const subtotal = getSubtotal()
        
        if (!discountPercent) return subtotal
        
        const discount = subtotal * (discountPercent / 100)
        return subtotal - discount
      }
    })) as PersistCartStore,
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        discountType: state.discountType,
        discountPercent: state.discountPercent
      })
    }
  )
) 