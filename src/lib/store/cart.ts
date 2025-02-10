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
        createdAt: new Date().toISOString()
      }]
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.itemId !== itemId)
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item
      )
    })),
  clearCart: () => set({ items: [] })
})) 