import Image from 'next/image'
import Link from 'next/link'
import { Topping } from '@/lib/types/cart'

interface PizzaItemProps {
  id: string
  name: string
  description: string
  basePrice: number
  imageUrl: string
  availableToppings: Topping[]
}

export function PizzaItem({
  id,
  name,
  description,
  basePrice,
  imageUrl
}: PizzaItemProps) {
  return (
    <Link
      href={`/menu/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent"
    >
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-1">
          <h3 className="font-medium">{name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-medium">From ${basePrice.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
} 