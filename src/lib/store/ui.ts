import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen }))
    }),
    {
      name: 'ui-store',
    }
  )
) 