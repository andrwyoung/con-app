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
      convention_history: {
        Row: {
          changes: string | null
          convention_history_id: string
          convention_id: number
          created_at: string
          updated_at: string | null
          year: number
        }
        Insert: {
          changes?: string | null
          convention_history_id?: string
          convention_id: number
          created_at?: string
          updated_at?: string | null
          year: number
        }
        Update: {
          changes?: string | null
          convention_history_id?: string
          convention_id?: number
          created_at?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "convention_history_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convention_history_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["id"]
          },
        ]
      }
      convention_years: {
        Row: {
          artist_app_deadline: string | null
          artist_app_first_heard: string | null
          artist_app_link: string | null
          artist_app_status:
            | Database["public"]["Enums"]["ApplicationStatus"]
            | null
          attendance_exact: number | null
          attendance_size: Database["public"]["Enums"]["ConventionSize"] | null
          convention_id: number
          created_at: string
          end_date: string | null
          id: string
          length_days: number | null
          start_date: string | null
          table_price: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          artist_app_deadline?: string | null
          artist_app_first_heard?: string | null
          artist_app_link?: string | null
          artist_app_status?:
            | Database["public"]["Enums"]["ApplicationStatus"]
            | null
          attendance_exact?: number | null
          attendance_size?: Database["public"]["Enums"]["ConventionSize"] | null
          convention_id: number
          created_at?: string
          end_date?: string | null
          id?: string
          length_days?: number | null
          start_date?: string | null
          table_price?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          artist_app_deadline?: string | null
          artist_app_first_heard?: string | null
          artist_app_link?: string | null
          artist_app_status?:
            | Database["public"]["Enums"]["ApplicationStatus"]
            | null
          attendance_exact?: number | null
          attendance_size?: Database["public"]["Enums"]["ConventionSize"] | null
          convention_id?: number
          created_at?: string
          end_date?: string | null
          id?: string
          length_days?: number | null
          start_date?: string | null
          table_price?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "convention_years_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convention_years_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["id"]
          },
        ]
      }
      conventions: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          event_status: string | null
          facebook_url: string | null
          fancons_link: string | null
          id: number
          image_url: string | null
          instagram_url: string | null
          location: string | null
          location_lat: number | null
          location_long: number | null
          name: string
          organizer: string | null
          organizer_url: string | null
          slug: string | null
          social_links: string | null
          tags: string[] | null
          updated_at: string | null
          venue: string | null
          website: string | null
          x_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          event_status?: string | null
          facebook_url?: string | null
          fancons_link?: string | null
          id?: number
          image_url?: string | null
          instagram_url?: string | null
          location?: string | null
          location_lat?: number | null
          location_long?: number | null
          name: string
          organizer?: string | null
          organizer_url?: string | null
          slug?: string | null
          social_links?: string | null
          tags?: string[] | null
          updated_at?: string | null
          venue?: string | null
          website?: string | null
          x_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          event_status?: string | null
          facebook_url?: string | null
          fancons_link?: string | null
          id?: number
          image_url?: string | null
          instagram_url?: string | null
          location?: string | null
          location_lat?: number | null
          location_long?: number | null
          name?: string
          organizer?: string | null
          organizer_url?: string | null
          slug?: string | null
          social_links?: string | null
          tags?: string[] | null
          updated_at?: string | null
          venue?: string | null
          website?: string | null
          x_url?: string | null
        }
        Relationships: []
      }
      conventions_v1: {
        Row: {
          created_at: string
          date: string | null
          days_length: number | null
          end_date: string | null
          id: number
          location: string | null
          name: string | null
          start_date: string | null
          url: string | null
          venue: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          days_length?: number | null
          end_date?: string | null
          id?: number
          location?: string | null
          name?: string | null
          start_date?: string | null
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          date?: string | null
          days_length?: number | null
          end_date?: string | null
          id?: number
          location?: string | null
          name?: string | null
          start_date?: string | null
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Relationships: []
      }
      full_convention_table: {
        Row: {
          created_at: string
          date: string | null
          days_length: number | null
          end_date: string | null
          id: number
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          start_date: string | null
          url: string | null
          venue: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          days_length?: number | null
          end_date?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          start_date?: string | null
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          date?: string | null
          days_length?: number | null
          end_date?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          start_date?: string | null
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          convention_id: number
          convention_years_id: string | null
          created_at: string
          review_id: string
          review_text: string
          stars: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          convention_id: number
          convention_years_id?: string | null
          created_at?: string
          review_id?: string
          review_text: string
          stars: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          convention_id?: number
          convention_years_id?: string | null
          created_at?: string
          review_id?: string
          review_text?: string
          stars?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_convention_years_id_fkey"
            columns: ["convention_years_id"]
            isOneToOne: false
            referencedRelation: "convention_years"
            referencedColumns: ["id"]
          },
        ]
      }
      user_convention_list: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          updated_at: string | null
          user_id: string
          visibility: Database["public"]["Enums"]["Visibility"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["Visibility"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["Visibility"]
        }
        Relationships: []
      }
      user_convention_list_item: {
        Row: {
          convention_id: number | null
          created_at: string
          id: string
          list_id: string | null
          user_id: string
        }
        Insert: {
          convention_id?: number | null
          created_at?: string
          id?: string
          list_id?: string | null
          user_id?: string
        }
        Update: {
          convention_id?: number | null
          created_at?: string
          id?: string
          list_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_convention_list_item_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_convention_list_item_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_convention_list_item_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "user_convention_list"
            referencedColumns: ["id"]
          },
        ]
      }
      user_convention_status: {
        Row: {
          convention_year_id: string | null
          created_at: string
          going_status: Database["public"]["Enums"]["GoingStatus"]
          note: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          convention_year_id?: string | null
          created_at?: string
          going_status?: Database["public"]["Enums"]["GoingStatus"]
          note?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          convention_year_id?: string | null
          created_at?: string
          going_status?: Database["public"]["Enums"]["GoingStatus"]
          note?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_convention_status_convention_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "convention_years"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          person_being_followed_id: string
          person_following_id: string
        }
        Insert: {
          created_at?: string
          person_being_followed_id: string
          person_following_id: string
        }
        Update: {
          created_at?: string
          person_being_followed_id?: string
          person_following_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          has_never_logged_in: boolean
          persona: Database["public"]["Enums"]["Persona"]
          role: Database["public"]["Enums"]["Role"]
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          has_never_logged_in?: boolean
          persona: Database["public"]["Enums"]["Persona"]
          role?: Database["public"]["Enums"]["Role"]
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          has_never_logged_in?: boolean
          persona?: Database["public"]["Enums"]["Persona"]
          role?: Database["public"]["Enums"]["Role"]
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      user_weekend_status: {
        Row: {
          available: boolean
          created_at: string
          notes: string | null
          updated_at: string | null
          user_id: string
          weekend_id: number | null
        }
        Insert: {
          available?: boolean
          created_at?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          weekend_id?: number | null
        }
        Update: {
          available?: boolean
          created_at?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          weekend_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_weekend_status_weekend_id_fkey"
            columns: ["weekend_id"]
            isOneToOne: false
            referencedRelation: "weekends"
            referencedColumns: ["weekend_id"]
          },
        ]
      }
      weekends: {
        Row: {
          end_date: string
          label: string
          month: number
          start_date: string
          weekend_id: number
          weekend_number: number
          year: number
        }
        Insert: {
          end_date: string
          label: string
          month: number
          start_date: string
          weekend_id?: number
          weekend_number: number
          year: number
        }
        Update: {
          end_date?: string
          label?: string
          month?: number
          start_date?: string
          weekend_id?: number
          weekend_number?: number
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      latest_convention_years: {
        Row: {
          address: string | null
          end_date: string | null
          event_status: string | null
          id: number | null
          location: string | null
          location_lat: number | null
          location_long: number | null
          name: string | null
          slug: string | null
          start_date: string | null
          tags: string[] | null
          venue: string | null
          year: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ApplicationStatus: "OPEN" | "CLOSED" | "WAITLIST" | "MAYBE"
      ConventionSize: "SEED" | "SMALL" | "MEDIUM" | "LARGE"
      GoingStatus:
        | "UNDECIDED"
        | "INTERESTED"
        | "APPLIED"
        | "TENTATIVE"
        | "GOING"
      Persona: "ATTENDEE" | "ARTIST" | "ORGANIZER"
      Role: "FREE" | "TIER_1" | "TIER_2" | "LIFETIME" | "ADMIN" | "SUDO"
      Visibility: "PUBLIC" | "LINK_ONLY" | "PRIVATE"
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
    Enums: {
      ApplicationStatus: ["OPEN", "CLOSED", "WAITLIST", "MAYBE"],
      ConventionSize: ["SEED", "SMALL", "MEDIUM", "LARGE"],
      GoingStatus: ["UNDECIDED", "INTERESTED", "APPLIED", "TENTATIVE", "GOING"],
      Persona: ["ATTENDEE", "ARTIST", "ORGANIZER"],
      Role: ["FREE", "TIER_1", "TIER_2", "LIFETIME", "ADMIN", "SUDO"],
      Visibility: ["PUBLIC", "LINK_ONLY", "PRIVATE"],
    },
  },
} as const
