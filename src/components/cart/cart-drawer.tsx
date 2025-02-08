"use client"

import { useCartStore } from "@/lib/store/cart"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
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
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 z-50 transform ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity ${
            isOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 h-full w-full max-w-md transform bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex h-[50vh] items-center justify-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="flex h-[calc(100vh-16rem)] flex-col gap-4 overflow-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.size.name}</p>
                    {item.toppings.length > 0 && (
                      <div className="mt-1 text-sm text-gray-500">
                        <p className="font-medium">Toppings:</p>
                        <ul className="list-inside list-disc">
                          {item.toppings.map(({ topping, isGrilled }) => (
                            <li key={topping.id}>
                              {topping.name}
                              {isGrilled !== undefined && (
                                <span className="text-gray-400">
                                  {" "}
                                  ({isGrilled ? "Grilled" : "Fresh"})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="mt-1 text-sm text-gray-500">
                        <p className="font-medium">Special Instructions:</p>
                        <p>{item.specialInstructions}</p>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded p-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="absolute bottom-0 left-0 w-full border-t bg-white p-6">
              {discountType && discountPercent && (
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">Discount ({discountType}):</span>
                  <span className="text-green-600">-{discountPercent}%</span>
                </div>
              )}
              <div className="mb-4 flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${getTotal().toFixed(2)}</span>
              </div>
              <button className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 