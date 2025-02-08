import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/client";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        }
      }
    }
  );

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Allow public access to menu pages and home page
  if (req.nextUrl.pathname === "/" || 
      req.nextUrl.pathname.startsWith("/menu") || 
      req.nextUrl.pathname.startsWith("/auth/")) {
    return res;
  }

  // Require authentication for all other routes
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Update the matcher to include menu routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
