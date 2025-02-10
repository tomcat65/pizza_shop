import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Toaster } from "sonner"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PhillyPizzaBueno Store",
  description: "Great Philly style pizza and much more @affordable prices",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
        <Footer />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
} 