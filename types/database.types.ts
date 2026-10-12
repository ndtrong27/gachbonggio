export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
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
