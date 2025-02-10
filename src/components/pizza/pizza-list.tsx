import { PizzaItem } from './pizza-item'
import { Topping } from '@/lib/types/cart'

interface MenuItem {
  id: string
  name: string
  description: string
  base_price: number
  category: string
  image_url: string
}

interface PizzaListProps {
  items: MenuItem[]
  availableToppings: Topping[]
}

export function PizzaList({ items, availableToppings }: PizzaListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <PizzaItem
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          basePrice={item.base_price}
          imageUrl={item.image_url}
          availableToppings={availableToppings}
        />
      ))}
    </div>
  )
} 