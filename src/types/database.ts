export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ShopCategory =
  | 'Fashion'
  | 'Electronics'
  | 'Food & Beverages'
  | 'Sports & Fitness'
  | 'Beauty & Health'
  | 'Books & Gifts'
  | 'Home & Living'
  | 'Entertainment'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface Database {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string
          name: string
          description: string | null
          category: ShopCategory
          floor: number
          coordinates: Coordinates
          position_3d: Position3D
          image_url: string | null
          opening_hours: Json | null
          contact_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['shops']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['shops']['Insert']>
      }
      promotions: {
        Row: {
          id: string
          shop_id: string
          title: string
          description: string | null
          discount_percentage: number | null
          valid_from: string
          valid_until: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['promotions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['promotions']['Insert']>
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          favorite_shops: string[]
          preferred_categories: ShopCategory[]
          notification_settings: {
            deals: boolean
            favorites: boolean
            nearby: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_preferences']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>
      }
    }
  }
}