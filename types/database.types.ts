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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_chat_logs: {
        Row: {
          admin_notes: string | null
          bot_response: string
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          rating: string | null
          reviewed_at: string | null
          session_id: string
          user_message: string
        }
        Insert: {
          admin_notes?: string | null
          bot_response: string
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          rating?: string | null
          reviewed_at?: string | null
          session_id: string
          user_message: string
        }
        Update: {
          admin_notes?: string | null
          bot_response?: string
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          rating?: string | null
          reviewed_at?: string | null
          session_id?: string
          user_message?: string
        }
        Relationships: []
      }
      ai_guidelines: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          priority: number
          rule_content: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          rule_content: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          rule_content?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author: string | null
          category: string
          conclusion: string | null
          cover_image: string
          created_at: string | null
          excerpt: string
          featured_product: Json | null
          id: string
          lead: string
          published: boolean | null
          published_at: string | null
          reading_time: string | null
          sections: Json | null
          slug: string
          target_section: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category: string
          conclusion?: string | null
          cover_image: string
          created_at?: string | null
          excerpt: string
          featured_product?: Json | null
          id: string
          lead: string
          published?: boolean | null
          published_at?: string | null
          reading_time?: string | null
          sections?: Json | null
          slug: string
          target_section?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          conclusion?: string | null
          cover_image?: string
          created_at?: string | null
          excerpt?: string
          featured_product?: Json | null
          id?: string
          lead?: string
          published?: boolean | null
          published_at?: string | null
          reading_time?: string | null
          sections?: Json | null
          slug?: string
          target_section?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gach_bong_gio: {
        Row: {
          content: string
          embedding: string | null
          id: number
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          content: string
          embedding?: string | null
          id: number
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          code: string
          color: string
          created_at: string | null
          id: number
          image_url: string | null
          in_stock: boolean | null
          name: string
          price: number | null
          price_display: string | null
          size: string
          slug: string
          source_url: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          code: string
          color: string
          created_at?: string | null
          id?: number
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          price?: number | null
          price_display?: string | null
          size: string
          slug: string
          source_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          code?: string
          color?: string
          created_at?: string | null
          id?: number
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number | null
          price_display?: string | null
          size?: string
          slug?: string
          source_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ai_agent_context: {
        Args: { max_results?: number; user_query: string }
        Returns: Json
      }
      get_products_pending_embedding: {
        Args: { max_limit?: number }
        Returns: {
          content: string
          id: number
        }[]
      }
      match_gach_bong_gio: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      search_gach_bong_gio_catalog: {
        Args: { max_results?: number; query_text: string }
        Returns: {
          category: string
          code: string
          color: string
          id: number
          image_url: string
          name: string
          price_display: string
          size: string
        }[]
      }
      search_products_catalog: {
        Args: { max_results?: number; query_text: string }
        Returns: {
          category: string
          code: string
          color: string
          id: number
          image_url: string
          name: string
          price_display: string
          size: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_product_embedding: {
        Args: { p_embedding: string; p_id: number }
        Returns: boolean
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
