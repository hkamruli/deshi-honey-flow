export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bonuses: {
        Row: {
          created_at: string
          display_mode: string
          id: string
          is_active: boolean
          name: string
          name_bn: string
          value: number
        }
        Insert: {
          created_at?: string
          display_mode?: string
          id?: string
          is_active?: boolean
          name: string
          name_bn: string
          value?: number
        }
        Update: {
          created_at?: string
          display_mode?: string
          id?: string
          is_active?: boolean
          name?: string
          name_bn?: string
          value?: number
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string
          delivery_charge: number
          id: string
          is_active: boolean
          name: string
          name_bn: string
        }
        Insert: {
          created_at?: string
          delivery_charge?: number
          id?: string
          is_active?: boolean
          name: string
          name_bn: string
        }
        Update: {
          created_at?: string
          delivery_charge?: number
          id?: string
          is_active?: boolean
          name?: string
          name_bn?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          area: string | null
          created_at: string
          customer_name: string
          delivery_charge: number
          district_id: string | null
          email: string | null
          full_address: string
          id: string
          ip_address: string | null
          order_number: string
          phone: string
          product_variation_id: string
          quantity: number
          referrer_url: string | null
          status: string
          total_amount: number
          unit_price: number
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          customer_name: string
          delivery_charge?: number
          district_id?: string | null
          email?: string | null
          full_address: string
          id?: string
          ip_address?: string | null
          order_number: string
          phone: string
          product_variation_id: string
          quantity?: number
          referrer_url?: string | null
          status?: string
          total_amount: number
          unit_price: number
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string
          customer_name?: string
          delivery_charge?: number
          district_id?: string | null
          email?: string | null
          full_address?: string
          id?: string
          ip_address?: string | null
          order_number?: string
          phone?: string
          product_variation_id?: string
          quantity?: number
          referrer_url?: string | null
          status?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_variation_id_fkey"
            columns: ["product_variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variations: {
        Row: {
          badge: string | null
          badge_bn: string | null
          bonus_ids: Json | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          name_bn: string
          original_price: number | null
          per_unit_label: string | null
          price: number
          size: string
          size_bn: string
          sort_order: number
        }
        Insert: {
          badge?: string | null
          badge_bn?: string | null
          bonus_ids?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          name_bn: string
          original_price?: number | null
          per_unit_label?: string | null
          price: number
          size: string
          size_bn: string
          sort_order?: number
        }
        Update: {
          badge?: string | null
          badge_bn?: string | null
          bonus_ids?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          name_bn?: string
          original_price?: number | null
          per_unit_label?: string | null
          price?: number
          size?: string
          size_bn?: string
          sort_order?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          district: string
          id: string
          is_active: boolean
          is_verified: boolean
          name: string
          photo_url: string | null
          rating: number
          review_text: string
        }
        Insert: {
          created_at?: string
          district: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name: string
          photo_url?: string | null
          rating?: number
          review_text: string
        }
        Update: {
          created_at?: string
          district?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name?: string
          photo_url?: string | null
          rating?: number
          review_text?: string
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_url: string | null
          referrer_url: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          referrer_url?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          referrer_url?: string | null
          user_agent?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
