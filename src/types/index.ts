export interface CartItem {
  id: string
  itemId: string
  name: string
  size: {
    id: string
    name: string
    price_adjustment: number | null
  }
  basePrice: number
  toppings: any[]
  quantity: number
  specialInstructions?: string
  crustType: 'thin' | 'regular' | 'thick'
  createdAt: Date
} 