import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem } from '../types/cart'
import { v4 as uuidv4 } from 'uuid'

interface CartState {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  isOpen: boolean
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isOpen: false,
      addToCart: (item) => set((state) => {
        // Create a unique identifier based on item properties
        const itemSignature = `${item.itemId}-${item.size.id}-${JSON.stringify(item.toppings)}`
        
        const existingItemIndex = state.cartItems.findIndex(i => {
          const existingSignature = `${i.itemId}-${i.size.id}-${JSON.stringify(i.toppings)}`
          return existingSignature === itemSignature
        })

        if (existingItemIndex >= 0) {
          // Update existing item
          const newItems = [...state.cartItems]
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: (newItems[existingItemIndex].quantity || 1) + 1
          }
          return { cartItems: newItems }
        }

        // Add new item with unique ID
        const newItem = {
          ...item,
          cartId: uuidv4(), // Generate a truly unique ID
          quantity: 1,
          basePrice: Number(item.basePrice) || 0,
          size: {
            ...item.size,
            price_adjustment: Number(item.size.price_adjustment) || 0
          },
          toppings: item.toppings.map(topping => ({
            ...topping,
            price: Number(topping.price) || 0
          }))
        }
        return { cartItems: [...state.cartItems, newItem] }
      }),
      removeFromCart: (cartId) => set((state) => ({ 
        cartItems: state.cartItems.filter((item) => item.cartId !== cartId) 
      })),
      updateQuantity: (cartId, quantity) => set((state) => ({
        cartItems: state.cartItems.map(item =>
          item.cartId === cartId ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ cartItems: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      getTotalPrice: () => {
        const { cartItems } = get()
        return cartItems.reduce((total, item) => {
          // Ensure all numbers are properly converted
          const basePrice = Number(item.basePrice) || 0
          const sizeAdjustment = Number(item.size?.price_adjustment) || 0
          const toppingsTotal = item.toppings?.reduce((sum, topping) => 
            sum + (Number(topping.price) || 0), 0) || 0
          
          const itemTotal = (basePrice + sizeAdjustment + toppingsTotal) * 
            (Number(item.quantity) || 1)
          
          return total + itemTotal
        }, 0)
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true
    }
  )
) 