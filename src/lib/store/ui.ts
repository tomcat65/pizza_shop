import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isOpen: boolean
  toggleCart: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen }))
    }),
    {
      name: 'ui-store',
    }
  )
) 