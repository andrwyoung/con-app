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
            referencedRelation: "aa_admin_items"
            referencedColumns: ["convention_id"]
          },
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
          aa_deadline: string | null
          aa_link: string | null
          aa_open_date: string | null
          aa_real_release: boolean | null
          aa_status_override: string | null
          aa_table_price: number | null
          aa_watch_link: boolean | null
          convention_id: number
          created_at: string
          end_date: string | null
          event_status: string
          g_link: string | null
          id: string
          location: string | null
          start_date: string
          updated_at: string | null
          venue: string | null
          year: number
        }
        Insert: {
          aa_deadline?: string | null
          aa_link?: string | null
          aa_open_date?: string | null
          aa_real_release?: boolean | null
          aa_status_override?: string | null
          aa_table_price?: number | null
          aa_watch_link?: boolean | null
          convention_id: number
          created_at?: string
          end_date?: string | null
          event_status?: string
          g_link?: string | null
          id?: string
          location?: string | null
          start_date: string
          updated_at?: string | null
          venue?: string | null
          year: number
        }
        Update: {
          aa_deadline?: string | null
          aa_link?: string | null
          aa_open_date?: string | null
          aa_real_release?: boolean | null
          aa_status_override?: string | null
          aa_table_price?: number | null
          aa_watch_link?: boolean | null
          convention_id?: number
          created_at?: string
          end_date?: string | null
          event_status?: string
          g_link?: string | null
          id?: string
          location?: string | null
          start_date?: string
          updated_at?: string | null
          venue?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "convention_years_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "aa_admin_items"
            referencedColumns: ["convention_id"]
          },
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
          con_size: string | null
          created_at: string
          cs_description: string | null
          facebook_url: string | null
          fancons_link: string | null
          id: number
          instagram_url: string | null
          location: string | null
          location_lat: number | null
          location_long: number | null
          name: string
          organizer_id: string | null
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
          con_size?: string | null
          created_at?: string
          cs_description?: string | null
          facebook_url?: string | null
          fancons_link?: string | null
          id?: number
          instagram_url?: string | null
          location?: string | null
          location_lat?: number | null
          location_long?: number | null
          name: string
          organizer_id?: string | null
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
          con_size?: string | null
          created_at?: string
          cs_description?: string | null
          facebook_url?: string | null
          fancons_link?: string | null
          id?: number
          instagram_url?: string | null
          location?: string | null
          location_lat?: number | null
          location_long?: number | null
          name?: string
          organizer_id?: string | null
          slug?: string | null
          social_links?: string | null
          tags?: string[] | null
          updated_at?: string | null
          venue?: string | null
          website?: string | null
          x_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conventions_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["organizer_id"]
          },
        ]
      }
      organizers: {
        Row: {
          created_at: string
          organizer_description: string | null
          organizer_id: string
          organizer_name: string
          organizer_website: string | null
        }
        Insert: {
          created_at?: string
          organizer_description?: string | null
          organizer_id?: string
          organizer_name: string
          organizer_website?: string | null
        }
        Update: {
          created_at?: string
          organizer_description?: string | null
          organizer_id?: string
          organizer_name?: string
          organizer_website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          anonymous: boolean
          convention_id: number
          convention_years_id: string | null
          created_at: string
          review_id: string
          review_text: string
          stars: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anonymous?: boolean
          convention_id: number
          convention_years_id?: string | null
          created_at?: string
          review_id?: string
          review_text: string
          stars?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          anonymous?: boolean
          convention_id?: number
          convention_years_id?: string | null
          created_at?: string
          review_id?: string
          review_text?: string
          stars?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "aa_admin_items"
            referencedColumns: ["convention_id"]
          },
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
          {
            foreignKeyName: "reviews_convention_years_id_fkey"
            columns: ["convention_years_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["convention_year_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      suggestions_artist_alley: {
        Row: {
          aa_deadline: string | null
          aa_link: string | null
          aa_open_date: string | null
          aa_real_release: boolean | null
          aa_status: string | null
          aa_status_override: string | null
          aa_watch_link: boolean | null
          approval_status: string
          approved_by: string | null
          convention_year_id: string
          created_at: string
          id: string
          merged_at: string | null
          submitted_by: string | null
        }
        Insert: {
          aa_deadline?: string | null
          aa_link?: string | null
          aa_open_date?: string | null
          aa_real_release?: boolean | null
          aa_status?: string | null
          aa_status_override?: string | null
          aa_watch_link?: boolean | null
          approval_status: string
          approved_by?: string | null
          convention_year_id: string
          created_at?: string
          id?: string
          merged_at?: string | null
          submitted_by?: string | null
        }
        Update: {
          aa_deadline?: string | null
          aa_link?: string | null
          aa_open_date?: string | null
          aa_real_release?: boolean | null
          aa_status?: string | null
          aa_status_override?: string | null
          aa_watch_link?: boolean | null
          approval_status?: string
          approved_by?: string | null
          convention_year_id?: string
          created_at?: string
          id?: string
          merged_at?: string | null
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_artist_alley_convention_year_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "convention_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_artist_alley_convention_year_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["convention_year_id"]
          },
        ]
      }
      suggestions_con_details: {
        Row: {
          approval_status: string
          approved_by: string | null
          con_size: string | null
          convention_id: number
          created_at: string
          id: string
          merged_at: string | null
          new_description: string | null
          new_end_date: string | null
          new_g_link: string | null
          new_social_links: string | null
          new_start_date: string | null
          new_status: string | null
          new_tags: string | null
          new_website: string | null
          notes: string | null
          organizer_id: string | null
          organizer_name: string | null
          submitted_by: string | null
        }
        Insert: {
          approval_status: string
          approved_by?: string | null
          con_size?: string | null
          convention_id: number
          created_at?: string
          id?: string
          merged_at?: string | null
          new_description?: string | null
          new_end_date?: string | null
          new_g_link?: string | null
          new_social_links?: string | null
          new_start_date?: string | null
          new_status?: string | null
          new_tags?: string | null
          new_website?: string | null
          notes?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          submitted_by?: string | null
        }
        Update: {
          approval_status?: string
          approved_by?: string | null
          con_size?: string | null
          convention_id?: number
          created_at?: string
          id?: string
          merged_at?: string | null
          new_description?: string | null
          new_end_date?: string | null
          new_g_link?: string | null
          new_social_links?: string | null
          new_start_date?: string | null
          new_status?: string | null
          new_tags?: string | null
          new_website?: string | null
          notes?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_con_details_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "aa_admin_items"
            referencedColumns: ["convention_id"]
          },
          {
            foreignKeyName: "suggestions_con_details_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_con_details_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions_new_year: {
        Row: {
          approval_status: string
          approved_by: string | null
          convention_id: number
          created_at: string
          end_date: string | null
          g_link: string | null
          id: string
          merged_at: string | null
          start_date: string
          submitted_by: string | null
        }
        Insert: {
          approval_status: string
          approved_by?: string | null
          convention_id: number
          created_at?: string
          end_date?: string | null
          g_link?: string | null
          id?: string
          merged_at?: string | null
          start_date: string
          submitted_by?: string | null
        }
        Update: {
          approval_status?: string
          approved_by?: string | null
          convention_id?: number
          created_at?: string
          end_date?: string | null
          g_link?: string | null
          id?: string
          merged_at?: string | null
          start_date?: string
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_new_year_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "aa_admin_items"
            referencedColumns: ["convention_id"]
          },
          {
            foreignKeyName: "suggestions_new_year_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_new_year_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["id"]
          },
        ]
      }
      user_convention_list_items: {
        Row: {
          convention_id: number
          convention_year_id: string | null
          created_at: string
          list_id: string
          list_item_id: string
          notes: string | null
          sort_order: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          convention_id: number
          convention_year_id?: string | null
          created_at?: string
          list_id: string
          list_item_id?: string
          notes?: string | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          convention_id?: number
          convention_year_id?: string | null
          created_at?: string
          list_id?: string
          list_item_id?: string
          notes?: string | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_convention_list_item_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "aa_admin_items"
            referencedColumns: ["convention_id"]
          },
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
            foreignKeyName: "user_convention_list_items_convention_year_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "convention_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_convention_list_items_convention_year_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["convention_year_id"]
          },
        ]
      }
      user_convention_lists: {
        Row: {
          created_at: string
          id: string
          label: string
          list_id: string
          notes: string | null
          special_type: string | null
          updated_at: string | null
          user_id: string
          visibility: Database["public"]["Enums"]["Visibility"]
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          list_id: string
          notes?: string | null
          special_type?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["Visibility"]
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          list_id?: string
          notes?: string | null
          special_type?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["Visibility"]
        }
        Relationships: []
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
      aa_admin_items: {
        Row: {
          aa_deadline: string | null
          aa_link: string | null
          aa_open_date: string | null
          aa_real_release: boolean | null
          aa_status: string | null
          aa_status_override: string | null
          aa_watch_link: boolean | null
          approval_status: string | null
          approved_by: string | null
          approved_username: string | null
          convention_id: number | null
          convention_name: string | null
          convention_year:
            | Database["public"]["Tables"]["convention_years"]["Row"]
            | null
          convention_year_id: string | null
          created_at: string | null
          id: string | null
          is_latest_year: boolean | null
          merged_at: string | null
          submitted_by: string | null
          submitted_username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_artist_alley_convention_year_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "convention_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_artist_alley_convention_year_id_fkey"
            columns: ["convention_year_id"]
            isOneToOne: false
            referencedRelation: "latest_convention_years"
            referencedColumns: ["convention_year_id"]
          },
        ]
      }
      latest_convention_years: {
        Row: {
          aa_deadline: string | null
          aa_link: string | null
          aa_open_date: string | null
          aa_real_release: boolean | null
          aa_status_override: string | null
          aa_watch_link: boolean | null
          convention_year_id: string | null
          event_status: string | null
          id: number | null
          latest_end_date: string | null
          latest_start_date: string | null
          latest_year: number | null
          location: string | null
          location_lat: number | null
          location_long: number | null
          name: string | null
          slug: string | null
          tags: string[] | null
          venue: string | null
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
