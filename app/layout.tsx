import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Online Food Store",
  description: "Great food, affordable prices",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        {children}
        <CartDrawer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
} 