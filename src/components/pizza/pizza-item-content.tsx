import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { ToppingsSection } from './toppings-section'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'
import { CartItem, Topping } from '@/lib/types/cart'

interface PizzaItemContentProps {
  id: string
  name: string
  description: string
  basePrice: number
  imageUrl: string
  availableToppings: Topping[]
}

const SIZES = [
  { name: 'small', label: 'Small', priceMultiplier: 1 },
  { name: 'medium', label: 'Medium', priceMultiplier: 1.2 },
  { name: 'large', label: 'Large', priceMultiplier: 1.4 }
] as const

const CRUST_TYPES = [
  { name: 'thin', label: 'Thin' },
  { name: 'regular', label: 'Regular' },
  { name: 'thick', label: 'Thick' }
] as const

export function PizzaItemContent({
  id,
  name,
  description,
  basePrice,
  imageUrl,
  availableToppings
}: PizzaItemContentProps) {
  const [selectedSize, setSelectedSize] = useState<(typeof SIZES)[number]['name']>('medium')
  const [selectedCrustType, setSelectedCrustType] = useState<(typeof CRUST_TYPES)[number]['name']>('regular')
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([])
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')

  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const selectedSizeData = SIZES.find((size) => size.name === selectedSize)!
  const adjustedBasePrice = basePrice * selectedSizeData.priceMultiplier

  const totalPrice = (
    adjustedBasePrice +
    selectedToppings.reduce((acc, topping) => acc + topping.price, 0)
  ) * quantity

  const handleAddToCart = () => {
    const cartItem: Omit<CartItem, 'id' | 'createdAt'> = {
      itemId: id,
      name,
      size: selectedSize,
      crustType: selectedCrustType,
      basePrice: adjustedBasePrice,
      toppings: selectedToppings,
      quantity,
      specialInstructions: specialInstructions.trim() || undefined
    }

    addItem(cartItem)
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${name} (${selectedSize}) added to your cart.`
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="rounded-lg object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Size</h3>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <Button
                  key={size.name}
                  variant={selectedSize === size.name ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size.name)}
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Crust</h3>
            <div className="flex gap-2">
              {CRUST_TYPES.map((crustType) => (
                <Button
                  key={crustType.name}
                  variant={selectedCrustType === crustType.name ? 'default' : 'outline'}
                  onClick={() => setSelectedCrustType(crustType.name)}
                >
                  {crustType.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Toppings</h3>
            <ToppingsSection
              selectedToppings={selectedToppings}
              onToppingsChange={setSelectedToppings}
              availableToppings={availableToppings}
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Any special instructions? (Optional)"
              rows={2}
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between text-lg font-medium">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 