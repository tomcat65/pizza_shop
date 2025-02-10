import { create } from 'zustand'
import { CartItem } from '../types/cart'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'createdAt'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => 
    set((state) => ({
      items: [...state.items, {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        toppings: item.toppings.map(topping => ({
          ...topping,
          name: topping.name.startsWith('XTRA-') ? topping.name : topping.name + (topping.isGrilled ? ' (Grilled)' : '')
        }))
      }]
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    })),
  clearCart: () => set({ items: [] })
})) 