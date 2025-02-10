export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      toppings: {
        Row: {
          id: string
          name: string
          price: number
          category: 'cheese' | 'meat' | 'veggie'
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: 'cheese' | 'meat' | 'veggie'
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: 'cheese' | 'meat' | 'veggie'
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          category_id: string | null
          image_url: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          category_id?: string | null
          image_url?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          category_id?: string | null
          image_url?: string | null
          active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 