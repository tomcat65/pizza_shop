import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { CustomizeAttention } from "@/components/customize-attention"
import type { Database } from "@/lib/supabase/database.types"

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
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-lg text-gray-600">Store information not found</p>
        </div>
      );
    }

    if (!items) {
      return (
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-lg text-gray-600">Menu items not available</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Store Info */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">{store.name}</h1>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-gray-600">{store.phone}</p>
        </div>

        {/* Menu Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border p-4 transition-colors hover:border-orange-500"
            >
              <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                {item.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>

                {/* Customization Message - With Chef Hat Icon */}
                <CustomizeAttention />

                {/* Sizes and Prices */}
                <div className="mt-3 space-y-2">
                  {item.sizes?.map((size: ItemSize) => (
                    <Link
                      key={size.id}
                      href={{
                        pathname: `/menu/${item.id}`,
                        query: { size: size.id }
                      }}
                      className="flex justify-between items-center p-2 rounded hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <span className="font-medium">{size.name}</span>
                      <span className="text-orange-600 font-semibold">
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
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return <div>Error loading page. Please try again later.</div>;
  }
}
