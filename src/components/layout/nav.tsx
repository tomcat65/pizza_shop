"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";

export function MainNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const cartItems = useCartStore((state) => state.items);
  const { toggleCart } = useUIStore();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="philly-nav sticky top-0 z-50">
      <div className="philly-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)] tracking-wider"
          >
            <Image 
              src="/images/pizza_slice.svg"
              alt="Pizza Logo"
              width={48}
              height={48}
              className="invert"
              priority
            />
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

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/menu"
              className={`philly-nav-link ${
                pathname === "/menu" ? "bg-philly-green-600" : ""
              }`}
            >
              Menu
            </Link>
            {user ? (
              <>
                <Link
                  href="/orders"
                  className={`philly-nav-link ${
                    pathname === "/orders" ? "bg-philly-green-600" : ""
                  }`}
                >
                  Orders
                </Link>
                <button
                  onClick={signOut}
                  className="philly-nav-link"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="philly-nav-link"
              >
                Sign In
              </Link>
            )}

            {/* Cart indicator */}
            <div className="relative">
              <button 
                onClick={toggleCart}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-philly-red text-xs font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/menu"
              className={`block philly-nav-link ${
                pathname === "/menu" ? "bg-philly-green-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            {user ? (
              <>
                <Link
                  href="/orders"
                  className={`block philly-nav-link ${
                    pathname === "/orders" ? "bg-philly-green-600" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left philly-nav-link"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block philly-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
