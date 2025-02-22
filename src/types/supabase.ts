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
      cohort_mentors: {
        Row: {
          cohort_id: string
          created_at: string
          mentor_id: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          mentor_id: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          mentor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_mentors_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_mentors_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["cohort_status"]
          subcounty: Database["public"]["Enums"]["mombasa_subcounty"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["cohort_status"]
          subcounty: Database["public"]["Enums"]["mombasa_subcounty"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["cohort_status"]
          subcounty?: Database["public"]["Enums"]["mombasa_subcounty"]
          updated_at?: string
        }
        Relationships: []
      }
      mentees: {
        Row: {
          cohort_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          subcounty: Database["public"]["Enums"]["mombasa_subcounty"]
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          subcounty: Database["public"]["Enums"]["mombasa_subcounty"]
        }
        Update: {
          cohort_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          subcounty?: Database["public"]["Enums"]["mombasa_subcounty"]
        }
        Relationships: [
          {
            foreignKeyName: "mentees_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          subcounty: Database["public"]["Enums"]["mombasa_subcounty"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          subcounty: Database["public"]["Enums"]["mombasa_subcounty"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          subcounty?: Database["public"]["Enums"]["mombasa_subcounty"]
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
      cohort_status: "active" | "completed" | "pending"
      mombasa_subcounty:
        | "likoni"
        | "mvita"
        | "kisauni"
        | "nyali"
        | "changamwe"
        | "jomvu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
