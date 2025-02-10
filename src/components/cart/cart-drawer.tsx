"use client"

import { useCartStore } from "@/lib/store/cart"
import { useUIStore } from "@/lib/store/ui"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

export function CartDrawer() {
  const [mounted, setMounted] = useState(false)
  const { isCartOpen, closeCart } = useUIStore()
  const { 
    items, 
    getSubtotal, 
    getTotal, 
    updateItemQuantity, 
    removeItem,
    discountType,
    discountPercent 
  } = useCartStore()

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[100] transform ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isCartOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-philly-green p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button
              onClick={closeCart}
              className="rounded-full p-2 hover:bg-philly-green-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex h-[50vh] items-center justify-center text-philly-silver-600">
            Your cart is empty
          </div>
        ) : (
          <div className="flex h-[calc(100vh-16rem)] flex-col gap-4 overflow-auto p-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="philly-card p-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-philly-green-800">{item.name}</h3>
                  <p className="text-sm text-philly-silver-600">{item.size.name}</p>
                  {item.toppings.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-philly-green-700">Toppings:</p>
                      <ul className="mt-1 space-y-1">
                        {item.toppings.map(({ topping, isGrilled }) => (
                          <li key={topping.id} className="text-sm text-philly-silver-700 flex items-center">
                            <span className="h-1 w-1 rounded-full bg-philly-green-400 mr-2" />
                            {topping.name}
                            {isGrilled !== undefined && (
                              <span className="text-philly-silver-500 ml-1">
                                ({isGrilled ? "Grilled" : "Fresh"})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-philly-green-700">Special Instructions:</p>
                      <p className="text-sm text-philly-silver-700">{item.specialInstructions}</p>
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded p-1 hover:bg-philly-green-50 disabled:opacity-50 disabled:hover:bg-transparent"
                      >
                        <Minus className="h-4 w-4 text-philly-green-600" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="rounded p-1 hover:bg-philly-green-50"
                      >
                        <Plus className="h-4 w-4 text-philly-green-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded p-1 text-philly-red hover:bg-philly-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full border-t border-philly-silver-200 bg-white p-6">
            {discountType && discountPercent && (
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-philly-silver-600">Discount ({discountType}):</span>
                <span className="text-philly-green">-{discountPercent}%</span>
              </div>
            )}
            <div className="mb-4 flex justify-between">
              <span className="font-medium text-philly-green-800">Total:</span>
              <span className="font-bold text-philly-green">${getTotal().toFixed(2)}</span>
            </div>
            <button className="philly-button w-full">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 