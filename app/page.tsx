import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { CustomizeAttention } from "@/components/customize-attention"
import type { Database } from "@/lib/supabase/database.types"
import { MainNav } from "@/components/layout/nav"
import { BackButton } from "@/components/layout/back-button"

export const dynamic = "force-dynamic"

type ItemSize = Database['public']['Tables']['item_sizes']['Row']

export default async function Page() {
  const supabase = createClient()
  
  async function getStoreInfo() {
    try {
      const { data, error } = await supabase.from("stores").select("*").single()
      if (error) {
        console.error("Supabase error:", error.message, error.details)
        return null
      }
      return data
    } catch (e) {
      console.error("Unexpected error:", e)
      return null
    }
  }

  async function getMenuItems() {
    try {
      const { data, error } = await supabase
        .from("items")
        .select(`
          *,
          category:categories(name),
          sizes:item_sizes(*)
        `)
        .eq("active", true)
        .order("name")

      if (error) {
        console.error("Supabase error:", error.message, error.details)
        return null
      }
      return data
    } catch (e) {
      console.error("Unexpected error:", e)
      return null
    }
  }

  try {
    const [store, items] = await Promise.all([getStoreInfo(), getMenuItems()])

    if (!store) {
      return (
        <div className="min-h-screen">
          <MainNav />
          <div className="flex h-[50vh] items-center justify-center">
            <p className="text-lg text-gray-600">Store information not found</p>
          </div>
        </div>
      )
    }

    if (!items) {
      return (
        <div className="min-h-screen">
          <MainNav />
          <div className="flex h-[50vh] items-center justify-center">
            <p className="text-lg text-gray-600">Menu items not available</p>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-philly-green-50 via-white to-philly-blue-50">
        <MainNav />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'url(https://sovfgykechixokxewvnp.supabase.co/storage/v1/object/public/menu_items_images/page_assets/3-Cheese.gif)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Content */}
          <div className="relative philly-container py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 philly-text-gradient">
                Craft Your Perfect Pizza
              </h1>
              <Link href="/menu" className="philly-button inline-flex items-center gap-2">
                <Image 
                  src="/images/chef_hat_moustache.svg"
                  alt="Chef"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                Customize Your Pizza
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Items */}
        <div className="py-16 bg-white">
          <div className="philly-container">
            <h2 className="text-3xl font-bold text-center mb-12 philly-text-gradient">
              Featured Items
            </h2>
            <div className="philly-grid">
              {items.map((item) => (
                <div key={item.id} className="philly-card overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden bg-philly-silver-100">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={400}
                        height={225}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-philly-silver-200">
                        <span className="text-philly-silver-600">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                    <CustomizeAttention />

                    <div className="mt-4 space-y-2">
                      {item.sizes?.map((size: ItemSize) => (
                        <Link
                          key={size.id}
                          href={`/pizza_menu/${item.id}?size=${size.id}`}
                          className="flex items-center justify-between p-2 rounded hover:bg-philly-green-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Image 
                              src="/images/chef_hat_moustache.svg"
                              alt="Chef"
                              width={20}
                              height={20}
                              className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="font-medium">{size.name}</span>
                          </div>
                          <span className="text-philly-green font-semibold">
                            ${(Number(item.base_price) + Number(size.price_adjustment)).toFixed(2)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-philly-green-50">
          <div className="philly-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-xl font-bold mb-4 text-philly-green">Fresh Ingredients</h3>
                <p className="text-philly-green-700">We use only the freshest ingredients, sourced locally when possible.</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-bold mb-4 text-philly-green">Fast Delivery</h3>
                <p className="text-philly-green-700">Quick and reliable delivery to your doorstep.</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-bold mb-4 text-philly-green">Custom Orders</h3>
                <p className="text-philly-green-700">Customize your order just the way you like it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading page:", error)
    return (
      <div className="min-h-screen">
        <MainNav />
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-lg text-red-600">Error loading page. Please try again later.</p>
        </div>
      </div>
    )
  }
}
