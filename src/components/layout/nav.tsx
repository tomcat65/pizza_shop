"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function MainNav() {
  const pathname = usePathname();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [user, setUser] = useState<any>(null);

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

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">PhillyPizzaBueno</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            <Link
              href="/menu"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === "/menu" ? "text-orange-500" : "text-foreground"
              }`}
            >
              Menu
            </Link>
            {user ? (
              <>
                <Link
                  href="/orders"
                  className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                    pathname === "/orders"
                      ? "text-orange-500"
                      : "text-foreground"
                  }`}
                >
                  Orders
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm font-medium text-foreground transition-colors hover:text-orange-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-foreground transition-colors hover:text-orange-500"
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
