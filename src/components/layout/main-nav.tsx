"use client"

import { useCartStore } from '@/lib/store/cart'
import { useUIStore } from '@/lib/store/ui'
import { Menu, X, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function MainNav() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { items } = useCartStore()
  const { openCart } = useUIStore()

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCartClick = () => {
    openCart()
    if (items.length > 0) {
      toast.message(`${items.length} item${items.length === 1 ? '' : 's'} in cart`, {
        className: "philly-toast",
        style: {
          backgroundColor: "#004C54",
          color: "white",
          border: "none",
        },
        position: "bottom-center",
      })
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  if (!mounted) return null

  return (
    <nav className="philly-nav sticky top-0 z-50">
      <div className="philly-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="philly-nav-link font-bold text-xl">
            PhillyPizzaBueno
          </Link>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-philly-silver-200 hover:bg-philly-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Menu Categories */}
            <div className="flex items-center space-x-4">
              <span className="philly-nav-link cursor-not-allowed opacity-70">Pizza</span>
              <span className="philly-nav-link cursor-not-allowed opacity-70">Wings</span>
              <span className="philly-nav-link cursor-not-allowed opacity-70">Cheesesteaks</span>
              <span className="philly-nav-link cursor-not-allowed opacity-70">Sides</span>
              <span className="philly-nav-link cursor-not-allowed opacity-70">Drinks</span>
            </div>

            {/* Cart indicator */}
            <div className="relative">
              <button 
                onClick={handleCartClick}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-philly-red text-xs font-bold text-white">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <span className="block philly-nav-link cursor-not-allowed opacity-70">Pizza</span>
            <span className="block philly-nav-link cursor-not-allowed opacity-70">Wings</span>
            <span className="block philly-nav-link cursor-not-allowed opacity-70">Cheesesteaks</span>
            <span className="block philly-nav-link cursor-not-allowed opacity-70">Sides</span>
            <span className="block philly-nav-link cursor-not-allowed opacity-70">Drinks</span>
          </div>
        </div>
      </div>
    </nav>
  )
} 