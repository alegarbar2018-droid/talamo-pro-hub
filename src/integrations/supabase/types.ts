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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_mfa: {
        Row: {
          backup_codes_hash: string[] | null
          created_at: string
          enabled: boolean
          id: string
          last_used_at: string | null
          recovery_codes_used: number
          secret_encrypted: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes_hash?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          last_used_at?: string | null
          recovery_codes_used?: number
          secret_encrypted: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes_hash?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          last_used_at?: string | null
          recovery_codes_used?: number
          secret_encrypted?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_mfa_rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string
          failed_attempts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string
          failed_attempts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string
          failed_attempts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_mfa_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          mfa_enabled: boolean
          mfa_enforced_at: string | null
          mfa_required: boolean
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mfa_enabled?: boolean
          mfa_enforced_at?: string | null
          mfa_required?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mfa_enabled?: boolean
          mfa_enforced_at?: string | null
          mfa_required?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliation_reports: {
        Row: {
          created_at: string
          email: string | null
          id: string
          partner_id: string | null
          status: string | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          partner_id?: string | null
          status?: string | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          partner_id?: string | null
          status?: string | null
          uid?: string | null
        }
        Relationships: []
      }
      affiliations: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_affiliated: boolean
          partner_id: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_affiliated?: boolean
          partner_id: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_affiliated?: boolean
          partner_id?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          meta: Json | null
          resource: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          meta?: Json | null
          resource?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          meta?: Json | null
          resource?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      competitions: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          name: string
          rules: string
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          name: string
          rules: string
          starts_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          name?: string
          rules?: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_events: {
        Row: {
          course_id: string
          created_at: string
          id: string
          meta: Json | null
          user_id: string
          value: number | null
          verb: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          meta?: Json | null
          user_id: string
          value?: number | null
          verb: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          meta?: Json | null
          user_id?: string
          value?: number | null
          verb?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
        ]
      }
      course_items: {
        Row: {
          created_at: string
          duration_min: number | null
          external_url: string | null
          id: string
          kind: string
          mapping: Json | null
          provider: string
          status: string
          storage_key: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_min?: number | null
          external_url?: string | null
          id?: string
          kind: string
          mapping?: Json | null
          provider?: string
          status?: string
          storage_key?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_min?: number | null
          external_url?: string | null
          id?: string
          kind?: string
          mapping?: Json | null
          provider?: string
          status?: string
          storage_key?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      eas: {
        Row: {
          created_at: string
          description: string
          download_url: string | null
          id: string
          name: string
          params: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          download_url?: string | null
          id?: string
          name: string
          params?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          download_url?: string | null
          id?: string
          name?: string
          params?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_data: {
        Row: {
          created_at: string
          price: number
          rsi: number | null
          symbol: string
          timestamp: string
          volatility: number | null
          volume: number | null
        }
        Insert: {
          created_at?: string
          price: number
          rsi?: number | null
          symbol: string
          timestamp?: string
          volatility?: number | null
          volume?: number | null
        }
        Update: {
          created_at?: string
          price?: number
          rsi?: number | null
          symbol?: string
          timestamp?: string
          volatility?: number | null
          volume?: number | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          id: string
          resource: string
          role: Database["public"]["Enums"]["admin_role"]
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          resource: string
          role: Database["public"]["Enums"]["admin_role"]
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          moderation: Json | null
          section: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          moderation?: Json | null
          section: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          moderation?: Json | null
          section?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          first_name: string | null
          goal: string | null
          id: string
          interested_assets: string[] | null
          language: string | null
          last_name: string | null
          level: string | null
          notification_preferences: Json | null
          phone: string | null
          risk_tolerance: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          goal?: string | null
          id?: string
          interested_assets?: string[] | null
          language?: string | null
          last_name?: string | null
          level?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          goal?: string | null
          id?: string
          interested_assets?: string[] | null
          language?: string | null
          last_name?: string | null
          level?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          active: boolean
          clicks: number
          code: string
          created_at: string
          id: string
          signups: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          clicks?: number
          code: string
          created_at?: string
          id?: string
          signups?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          clicks?: number
          code?: string
          created_at?: string
          id?: string
          signups?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      signal_automation_config: {
        Row: {
          cooldown_minutes: number | null
          created_at: string
          enabled: boolean | null
          id: string
          last_signal_at: string | null
          rsi_overbought: number | null
          rsi_oversold: number | null
          symbol: string
          updated_at: string
          volatility_threshold: number | null
        }
        Insert: {
          cooldown_minutes?: number | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          last_signal_at?: string | null
          rsi_overbought?: number | null
          rsi_oversold?: number | null
          symbol: string
          updated_at?: string
          volatility_threshold?: number | null
        }
        Update: {
          cooldown_minutes?: number | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          last_signal_at?: string | null
          rsi_overbought?: number | null
          rsi_oversold?: number | null
          symbol?: string
          updated_at?: string
          volatility_threshold?: number | null
        }
        Relationships: []
      }
      signals: {
        Row: {
          audit_trail: Json | null
          author_id: string
          created_at: string
          entry_price: number | null
          id: string
          instrument: string
          invalidation: string
          logic: string
          media_urls: string[] | null
          published_at: string | null
          result: string | null
          reviewer_id: string | null
          rr: number
          scheduled_at: string | null
          source: string | null
          status: string
          stop_loss: number | null
          take_profit: number | null
          timeframe: string
          title: string
          updated_at: string
        }
        Insert: {
          audit_trail?: Json | null
          author_id: string
          created_at?: string
          entry_price?: number | null
          id?: string
          instrument: string
          invalidation: string
          logic: string
          media_urls?: string[] | null
          published_at?: string | null
          result?: string | null
          reviewer_id?: string | null
          rr: number
          scheduled_at?: string | null
          source?: string | null
          status?: string
          stop_loss?: number | null
          take_profit?: number | null
          timeframe: string
          title: string
          updated_at?: string
        }
        Update: {
          audit_trail?: Json | null
          author_id?: string
          created_at?: string
          entry_price?: number | null
          id?: string
          instrument?: string
          invalidation?: string
          logic?: string
          media_urls?: string[] | null
          published_at?: string | null
          result?: string | null
          reviewer_id?: string | null
          rr?: number
          scheduled_at?: string | null
          source?: string | null
          status?: string
          stop_loss?: number | null
          take_profit?: number | null
          timeframe?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          created_at: string
          description: string
          green_months_pct: number
          id: string
          max_dd: number
          name: string
          pf: number
          risk_tier: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          green_months_pct: number
          id?: string
          max_dd: number
          name: string
          pf: number
          risk_tier: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          green_months_pct?: number
          id?: string
          max_dd?: number
          name?: string
          pf?: number
          risk_tier?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          name: string
          status: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_validations: {
        Row: {
          created_at: string
          email: string
          id: string
          is_validated: boolean | null
          partner_id: string | null
          updated_at: string
          user_id: string
          validated_at: string | null
          validation_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_validated?: boolean | null
          partner_id?: string | null
          updated_at?: string
          user_id: string
          validated_at?: string | null
          validation_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_validated?: boolean | null
          partner_id?: string | null
          updated_at?: string
          user_id?: string
          validated_at?: string | null
          validation_source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_affiliation_by_email: {
        Args: { p_email: string }
        Returns: {
          is_affiliated: boolean
          partner_id: string
          user_exists: boolean
          user_id: string
        }[]
      }
      check_profile_data_exposure: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string
          issue_type: string
          severity: string
          table_name: string
        }[]
      }
      emergency_revoke_profile_access: {
        Args: { reason: string; target_user_id: string }
        Returns: boolean
      }
      get_basic_profile_for_admin: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_current_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_masked_profile: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_profile_security_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_recent_profile_access_attempts: {
        Args: { hours_back?: number }
        Returns: {
          access_reason: string
          access_time: string
          action: string
          actor_id: string
          target_user_id: string
        }[]
      }
      get_security_recommendations: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          priority: string
          recommendation: string
          status: string
        }[]
      }
      get_sensitive_profile_fields: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_sensitive_profile_for_admin: {
        Args: { justification: string; target_user_id: string }
        Returns: Json
      }
      has_active_mfa_session: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_admin_permission: {
        Args: { _action: string; _resource: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_profile_access: {
        Args: {
          access_reason?: string
          access_type: string
          accessed_fields?: string[]
          target_user_id: string
        }
        Returns: undefined
      }
      requires_mfa_for_operation: {
        Args: { _operation: string }
        Returns: boolean
      }
      security_checklist: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_item: string
          recommendation: string
          status: string
        }[]
      }
      trigger_data_collection: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      user_exists: {
        Args: { p_email: string }
        Returns: boolean
      }
      validate_profile_data_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_name: string
          details: string
          status: string
        }[]
      }
    }
    Enums: {
      admin_role: "ADMIN" | "ANALYST" | "CONTENT" | "SUPPORT" | "USER"
      app_role: "admin" | "trader" | "partner"
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
    Enums: {
      admin_role: ["ADMIN", "ANALYST", "CONTENT", "SUPPORT", "USER"],
      app_role: ["admin", "trader", "partner"],
    },
  },
} as const
