export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone_number: string
          relationship: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone_number: string
          relationship?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone_number?: string
          relationship?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      guardians: {
        Row: {
          created_at: string | null
          guardian_email: string | null
          guardian_name: string
          guardian_phone: string | null
          guardian_user_id: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          guardian_email?: string | null
          guardian_name: string
          guardian_phone?: string | null
          guardian_user_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          guardian_email?: string | null
          guardian_name?: string
          guardian_phone?: string | null
          guardian_user_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_anonymous: boolean | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          is_anonymous?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_anonymous?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      lost_items: {
        Row: {
          contact_info: string | null
          created_at: string
          description: string | null
          id: string
          item_name: string
          location_lost: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string
          description?: string | null
          id?: string
          item_name: string
          location_lost?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string
          description?: string | null
          id?: string
          item_name?: string
          location_lost?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          emergency_contact: string | null
          full_name: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          emergency_contact?: string | null
          full_name: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          emergency_contact?: string | null
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      safety_alerts: {
        Row: {
          alert_type: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          title?: string
        }
        Relationships: []
      }
      safety_timers: {
        Row: {
          created_at: string | null
          destination_coords: unknown | null
          destination_text: string | null
          duration_seconds: number
          id: string
          last_known_location: unknown | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          destination_coords?: unknown | null
          destination_text?: string | null
          duration_seconds: number
          id?: string
          last_known_location?: unknown | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          destination_coords?: unknown | null
          destination_text?: string | null
          duration_seconds?: number
          id?: string
          last_known_location?: unknown | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timer_guardians: {
        Row: {
          created_at: string | null
          guardian_contact_info: string | null
          guardian_name: string | null
          guardian_user_id: string | null
          id: string
          notified: boolean | null
          timer_id: string
        }
        Insert: {
          created_at?: string | null
          guardian_contact_info?: string | null
          guardian_name?: string | null
          guardian_user_id?: string | null
          id?: string
          notified?: boolean | null
          timer_id: string
        }
        Update: {
          created_at?: string | null
          guardian_contact_info?: string | null
          guardian_name?: string | null
          guardian_user_id?: string | null
          id?: string
          notified?: boolean | null
          timer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timer_guardians_timer_id_fkey"
            columns: ["timer_id"]
            isOneToOne: false
            referencedRelation: "safety_timers"
            referencedColumns: ["id"]
          },
        ]
      }
      university_updates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_official: boolean | null
          title: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_official?: boolean | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_official?: boolean | null
          title?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
