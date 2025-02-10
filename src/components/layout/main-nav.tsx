"use client"

import { useCartStore } from '@/lib/store/cart'
import { useUIStore } from '@/lib/store/ui'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function MainNav() {
  const [mounted, setMounted] = useState(false)
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

  if (!mounted) return null

  return (
    <nav className="philly-nav sticky top-0 z-50">
      <div className="philly-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="philly-nav-link font-bold">
            Philly Pizza
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/menu"
              className={`philly-nav-link ${
                pathname === '/menu' ? 'text-philly-green' : ''
              }`}
            >
              Menu
            </Link>

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
      </div>
    </nav>
  )
} 