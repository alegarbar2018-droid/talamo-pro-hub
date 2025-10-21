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
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "affiliations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_accounts: {
        Row: {
          broker: string
          created_at: string
          enc_credentials: string
          id: string
          last_sync_at: string | null
          login: string
          metaapi_account_id: string | null
          platform: string | null
          server: string
          status: string
          sync_error: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          broker?: string
          created_at?: string
          enc_credentials: string
          id?: string
          last_sync_at?: string | null
          login: string
          metaapi_account_id?: string | null
          platform?: string | null
          server: string
          status?: string
          sync_error?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          broker?: string
          created_at?: string
          enc_credentials?: string
          id?: string
          last_sync_at?: string | null
          login?: string
          metaapi_account_id?: string | null
          platform?: string | null
          server?: string
          status?: string
          sync_error?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_equity: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          equity: number
          id: string
          time: string
        }
        Insert: {
          account_id: string
          balance: number
          created_at?: string
          equity: number
          id?: string
          time: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          equity?: number
          id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_equity_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "audit_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      audit_stats_daily: {
        Row: {
          account_id: string
          avg_loss: number | null
          avg_win: number | null
          created_at: string
          date: string
          gross_loss: number | null
          gross_profit: number | null
          id: string
          max_dd: number | null
          profit_factor: number | null
          total_trades: number | null
          win_rate: number | null
        }
        Insert: {
          account_id: string
          avg_loss?: number | null
          avg_win?: number | null
          created_at?: string
          date: string
          gross_loss?: number | null
          gross_profit?: number | null
          id?: string
          max_dd?: number | null
          profit_factor?: number | null
          total_trades?: number | null
          win_rate?: number | null
        }
        Update: {
          account_id?: string
          avg_loss?: number | null
          avg_win?: number | null
          created_at?: string
          date?: string
          gross_loss?: number | null
          gross_profit?: number | null
          id?: string
          max_dd?: number | null
          profit_factor?: number | null
          total_trades?: number | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_stats_daily_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "audit_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_trades: {
        Row: {
          account_id: string
          close_price: number | null
          close_time: string | null
          commission: number | null
          created_at: string
          id: string
          open_price: number
          open_time: string
          profit: number | null
          swap: number | null
          symbol: string
          ticket: string
          type: string
          volume: number
        }
        Insert: {
          account_id: string
          close_price?: number | null
          close_time?: string | null
          commission?: number | null
          created_at?: string
          id?: string
          open_price: number
          open_time: string
          profit?: number | null
          swap?: number | null
          symbol: string
          ticket: string
          type: string
          volume: number
        }
        Update: {
          account_id?: string
          close_price?: number | null
          close_time?: string | null
          commission?: number | null
          created_at?: string
          id?: string
          open_price?: number
          open_time?: string
          profit?: number | null
          swap?: number | null
          symbol?: string
          ticket?: string
          type?: string
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "audit_trades_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "audit_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_verification: {
        Row: {
          account_id: string
          created_at: string
          expires_at: string
          found_at: string | null
          id: string
          key: string
          status: string
        }
        Insert: {
          account_id: string
          created_at?: string
          expires_at: string
          found_at?: string | null
          id?: string
          key: string
          status?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          expires_at?: string
          found_at?: string | null
          id?: string
          key?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_verification_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "audit_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      calculator_configs: {
        Row: {
          calculation_logic: Json
          calculator_id: string
          category: string
          created_at: string
          description: string
          formula_id: string | null
          icon: string
          id: string
          input_fields: Json
          name: string
          output_format: Json
          position: number
          requires_contracts: boolean | null
          status: string
          updated_at: string
        }
        Insert: {
          calculation_logic: Json
          calculator_id: string
          category: string
          created_at?: string
          description: string
          formula_id?: string | null
          icon?: string
          id?: string
          input_fields: Json
          name: string
          output_format: Json
          position?: number
          requires_contracts?: boolean | null
          status?: string
          updated_at?: string
        }
        Update: {
          calculation_logic?: Json
          calculator_id?: string
          category?: string
          created_at?: string
          description?: string
          formula_id?: string | null
          icon?: string
          id?: string
          input_fields?: Json
          name?: string
          output_format?: Json
          position?: number
          requires_contracts?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculator_configs_formula_id_fkey"
            columns: ["formula_id"]
            isOneToOne: false
            referencedRelation: "trading_formulas"
            referencedColumns: ["id"]
          },
        ]
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
      contract_specifications: {
        Row: {
          asset_class: string
          base_currency: string
          contract_size: number
          created_at: string
          id: string
          leverage_max: number | null
          lot_step: number
          margin_percentage: number | null
          max_lot: number
          metadata: Json | null
          min_lot: number
          name: string
          pip_position: number
          pip_value: number
          quote_currency: string | null
          spread_typical: number | null
          status: string
          swap_long: number | null
          swap_short: number | null
          symbol: string
          trading_hours: Json | null
          underlying_asset: string | null
          updated_at: string
        }
        Insert: {
          asset_class: string
          base_currency?: string
          contract_size: number
          created_at?: string
          id?: string
          leverage_max?: number | null
          lot_step?: number
          margin_percentage?: number | null
          max_lot?: number
          metadata?: Json | null
          min_lot?: number
          name: string
          pip_position?: number
          pip_value: number
          quote_currency?: string | null
          spread_typical?: number | null
          status?: string
          swap_long?: number | null
          swap_short?: number | null
          symbol: string
          trading_hours?: Json | null
          underlying_asset?: string | null
          updated_at?: string
        }
        Update: {
          asset_class?: string
          base_currency?: string
          contract_size?: number
          created_at?: string
          id?: string
          leverage_max?: number | null
          lot_step?: number
          margin_percentage?: number | null
          max_lot?: number
          metadata?: Json | null
          min_lot?: number
          name?: string
          pip_position?: number
          pip_value?: number
          quote_currency?: string | null
          spread_typical?: number | null
          status?: string
          swap_long?: number | null
          swap_short?: number | null
          symbol?: string
          trading_hours?: Json | null
          underlying_asset?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      copy_strategies: {
        Row: {
          account_type: string
          billing_period: string
          created_at: string | null
          created_by: string | null
          cumulative_return_data: Json | null
          id: string
          leverage: number
          max_drawdown: number | null
          min_investment: number
          monthly_return_percentage: number | null
          performance_fee_pct: number
          profit_factor: number | null
          risk_band: string | null
          status: string
          strategy_equity: number
          strategy_link: string
          symbols_traded: string[]
          total_return_percentage: number | null
          total_trades: number | null
          trader_avatar_url: string | null
          trader_bio: string | null
          trader_name: string
          updated_at: string | null
          win_rate: number | null
        }
        Insert: {
          account_type?: string
          billing_period?: string
          created_at?: string | null
          created_by?: string | null
          cumulative_return_data?: Json | null
          id?: string
          leverage?: number
          max_drawdown?: number | null
          min_investment: number
          monthly_return_percentage?: number | null
          performance_fee_pct?: number
          profit_factor?: number | null
          risk_band?: string | null
          status?: string
          strategy_equity?: number
          strategy_link?: string
          symbols_traded: string[]
          total_return_percentage?: number | null
          total_trades?: number | null
          trader_avatar_url?: string | null
          trader_bio?: string | null
          trader_name: string
          updated_at?: string | null
          win_rate?: number | null
        }
        Update: {
          account_type?: string
          billing_period?: string
          created_at?: string | null
          created_by?: string | null
          cumulative_return_data?: Json | null
          id?: string
          leverage?: number
          max_drawdown?: number | null
          min_investment?: number
          monthly_return_percentage?: number | null
          performance_fee_pct?: number
          profit_factor?: number | null
          risk_band?: string | null
          status?: string
          strategy_equity?: number
          strategy_link?: string
          symbols_traded?: string[]
          total_return_percentage?: number | null
          total_trades?: number | null
          trader_avatar_url?: string | null
          trader_bio?: string | null
          trader_name?: string
          updated_at?: string | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "copy_strategies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      copy_strategy_orders: {
        Row: {
          close_price: number | null
          closed_at: string | null
          created_at: string | null
          id: string
          open_price: number
          opened_at: string
          order_type: string
          profit_loss: number | null
          status: string
          strategy_id: string | null
          symbol: string
          volume: number
        }
        Insert: {
          close_price?: number | null
          closed_at?: string | null
          created_at?: string | null
          id?: string
          open_price: number
          opened_at: string
          order_type: string
          profit_loss?: number | null
          status?: string
          strategy_id?: string | null
          symbol: string
          volume: number
        }
        Update: {
          close_price?: number | null
          closed_at?: string | null
          created_at?: string | null
          id?: string
          open_price?: number
          opened_at?: string
          order_type?: string
          profit_loss?: number | null
          status?: string
          strategy_id?: string | null
          symbol?: string
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "copy_strategy_orders_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "copy_strategies"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "course_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
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
      journal_entries: {
        Row: {
          closed_at: string | null
          commission: number | null
          created_at: string | null
          direction: string
          emotions: string[] | null
          entry_price: number
          exit_price: number | null
          id: string
          instrument: string
          lot_size: number
          notes: string | null
          result: number | null
          result_pips: number | null
          screenshots: string[] | null
          status: string
          stop_loss: number | null
          swap: number | null
          tags: string[] | null
          take_profit: number | null
          trade_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          commission?: number | null
          created_at?: string | null
          direction: string
          emotions?: string[] | null
          entry_price: number
          exit_price?: number | null
          id?: string
          instrument: string
          lot_size: number
          notes?: string | null
          result?: number | null
          result_pips?: number | null
          screenshots?: string[] | null
          status?: string
          stop_loss?: number | null
          swap?: number | null
          tags?: string[] | null
          take_profit?: number | null
          trade_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          closed_at?: string | null
          commission?: number | null
          created_at?: string | null
          direction?: string
          emotions?: string[] | null
          entry_price?: number
          exit_price?: number | null
          id?: string
          instrument?: string
          lot_size?: number
          notes?: string | null
          result?: number | null
          result_pips?: number | null
          screenshots?: string[] | null
          status?: string
          stop_loss?: number | null
          swap?: number | null
          tags?: string[] | null
          take_profit?: number | null
          trade_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      journal_recommendations: {
        Row: {
          based_on_entries: string[] | null
          created_at: string | null
          id: string
          recommendation_text: string
          recommendation_type: string
          user_id: string
        }
        Insert: {
          based_on_entries?: string[] | null
          created_at?: string | null
          id?: string
          recommendation_text: string
          recommendation_type: string
          user_id: string
        }
        Update: {
          based_on_entries?: string[] | null
          created_at?: string | null
          id?: string
          recommendation_text?: string
          recommendation_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lms_answers: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean
          option_id: string | null
          question_id: string
          text_answer: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean
          option_id?: string | null
          question_id: string
          text_answer?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          option_id?: string | null
          question_id?: string
          text_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lms_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "lms_quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lms_answers_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "lms_quiz_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lms_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "lms_quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_courses: {
        Row: {
          created_at: string
          id: string
          item_id: string
          level: number | null
          slug: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          level?: number | null
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          level?: number | null
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_courses_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_lessons: {
        Row: {
          content_md: string | null
          cover_image: string | null
          created_at: string
          duration_min: number | null
          id: string
          item_id: string
          module_id: string
          position: number
          quiz_id: string | null
          resources: Json | null
          status: string
          updated_at: string
          video_external_url: string | null
          video_storage_key: string | null
        }
        Insert: {
          content_md?: string | null
          cover_image?: string | null
          created_at?: string
          duration_min?: number | null
          id?: string
          item_id: string
          module_id: string
          position?: number
          quiz_id?: string | null
          resources?: Json | null
          status?: string
          updated_at?: string
          video_external_url?: string | null
          video_storage_key?: string | null
        }
        Update: {
          content_md?: string | null
          cover_image?: string | null
          created_at?: string
          duration_min?: number | null
          id?: string
          item_id?: string
          module_id?: string
          position?: number
          quiz_id?: string | null
          resources?: Json | null
          status?: string
          updated_at?: string
          video_external_url?: string | null
          video_storage_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lms_lessons_quiz"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "lms_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lms_lessons_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lms_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "lms_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          item_id: string
          position: number
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          item_id: string
          position?: number
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          item_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "lms_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lms_modules_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "course_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          feedback: string | null
          id: string
          passed: boolean
          quiz_id: string
          reviewed: boolean
          score: number
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          feedback?: string | null
          id?: string
          passed: boolean
          quiz_id: string
          reviewed?: boolean
          score: number
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          feedback?: string | null
          id?: string
          passed?: boolean
          quiz_id?: string
          reviewed?: boolean
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "lms_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_quiz_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          position: number
          question_id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          position?: number
          question_id: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          position?: number
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "lms_quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_quiz_questions: {
        Row: {
          created_at: string
          feedback_correct: string | null
          feedback_incorrect: string | null
          id: string
          open_expected: string | null
          points: number
          position: number
          question: string
          quiz_id: string
          type: Database["public"]["Enums"]["quiz_question_type"]
        }
        Insert: {
          created_at?: string
          feedback_correct?: string | null
          feedback_incorrect?: string | null
          id?: string
          open_expected?: string | null
          points?: number
          position?: number
          question: string
          quiz_id: string
          type?: Database["public"]["Enums"]["quiz_question_type"]
        }
        Update: {
          created_at?: string
          feedback_correct?: string | null
          feedback_incorrect?: string | null
          id?: string
          open_expected?: string | null
          points?: number
          position?: number
          question?: string
          quiz_id?: string
          type?: Database["public"]["Enums"]["quiz_question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "lms_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "lms_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_quizzes: {
        Row: {
          attempt_limit: number | null
          created_at: string
          description: string | null
          id: string
          module_id: string | null
          pass_score: number
          position: number
          shuffle_questions: boolean
          status: string
          time_limit_sec: number | null
          title: string
          updated_at: string
        }
        Insert: {
          attempt_limit?: number | null
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string | null
          pass_score?: number
          position?: number
          shuffle_questions?: boolean
          status?: string
          time_limit_sec?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          attempt_limit?: number | null
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string | null
          pass_score?: number
          position?: number
          shuffle_questions?: boolean
          status?: string
          time_limit_sec?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "lms_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lms_resources: {
        Row: {
          created_at: string
          external_url: string | null
          id: string
          kind: string
          lesson_id: string
          position: number
          storage_key: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_url?: string | null
          id?: string
          kind: string
          lesson_id: string
          position?: number
          storage_key?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_url?: string | null
          id?: string
          kind?: string
          lesson_id?: string
          position?: number
          storage_key?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lms_lessons"
            referencedColumns: ["id"]
          },
        ]
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
      onboarding_analytics: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          session_id: string
          step_name: string
          step_number: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          session_id: string
          step_name: string
          step_number?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          step_name?: string
          step_number?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      onboarding_tutorials: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_seconds: number | null
          id: string
          is_active: boolean | null
          thumbnail_url: string | null
          title: string
          tutorial_key: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title: string
          tutorial_key: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title?: string
          tutorial_key?: string
          updated_at?: string | null
          video_url?: string | null
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
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: string | null
          avatar_url: string | null
          bio: string | null
          capital_band: string | null
          created_at: string
          email: string | null
          experience_score: number | null
          first_name: string | null
          goal: string | null
          id: string
          interested_assets: string[] | null
          language: string | null
          last_name: string | null
          level: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          phone: string | null
          platform_preference: string | null
          recommended_account: string | null
          recommended_route: string | null
          risk_tolerance: string | null
          trading_style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          capital_band?: string | null
          created_at?: string
          email?: string | null
          experience_score?: number | null
          first_name?: string | null
          goal?: string | null
          id?: string
          interested_assets?: string[] | null
          language?: string | null
          last_name?: string | null
          level?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          platform_preference?: string | null
          recommended_account?: string | null
          recommended_route?: string | null
          risk_tolerance?: string | null
          trading_style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          capital_band?: string | null
          created_at?: string
          email?: string | null
          experience_score?: number | null
          first_name?: string | null
          goal?: string | null
          id?: string
          interested_assets?: string[] | null
          language?: string | null
          last_name?: string | null
          level?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          platform_preference?: string | null
          recommended_account?: string | null
          recommended_route?: string | null
          risk_tolerance?: string | null
          trading_style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
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
          dedup_key: string
          direction: string | null
          entry_price: number | null
          id: string
          instrument: string | null
          invalidation: string | null
          logic: string
          media_urls: string[] | null
          published_at: string | null
          result: string | null
          reviewer_id: string | null
          rr: number | null
          scheduled_at: string | null
          source: string | null
          status: string
          stop_loss: number | null
          take_profit: number | null
          timeframe: string
          title: string | null
          updated_at: string
        }
        Insert: {
          audit_trail?: Json | null
          author_id?: string
          created_at?: string
          dedup_key: string
          direction?: string | null
          entry_price?: number | null
          id?: string
          instrument?: string | null
          invalidation?: string | null
          logic: string
          media_urls?: string[] | null
          published_at?: string | null
          result?: string | null
          reviewer_id?: string | null
          rr?: number | null
          scheduled_at?: string | null
          source?: string | null
          status?: string
          stop_loss?: number | null
          take_profit?: number | null
          timeframe: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          audit_trail?: Json | null
          author_id?: string
          created_at?: string
          dedup_key?: string
          direction?: string | null
          entry_price?: number | null
          id?: string
          instrument?: string | null
          invalidation?: string | null
          logic?: string
          media_urls?: string[] | null
          published_at?: string | null
          result?: string | null
          reviewer_id?: string | null
          rr?: number | null
          scheduled_at?: string | null
          source?: string | null
          status?: string
          stop_loss?: number | null
          take_profit?: number | null
          timeframe?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "signals_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
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
      trading_formulas: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          example_inputs: Json | null
          example_output: Json | null
          explanation: string
          formula_latex: string | null
          formula_plain: string
          id: string
          name: string
          related_calculators: string[] | null
          slug: string
          status: string
          updated_at: string
          variables: Json
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty?: string
          example_inputs?: Json | null
          example_output?: Json | null
          explanation: string
          formula_latex?: string | null
          formula_plain: string
          id?: string
          name: string
          related_calculators?: string[] | null
          slug: string
          status?: string
          updated_at?: string
          variables: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          example_inputs?: Json | null
          example_output?: Json | null
          explanation?: string
          formula_latex?: string | null
          formula_plain?: string
          id?: string
          name?: string
          related_calculators?: string[] | null
          slug?: string
          status?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          item_id: string
          item_kind: string
          module_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          item_id: string
          item_kind: string
          module_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          item_id?: string
          item_kind?: string
          module_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "lms_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "lms_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_validations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      v_admin_users: {
        Row: {
          admin_role: Database["public"]["Enums"]["admin_role"] | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          is_affiliated: boolean | null
          last_name: string | null
          partner_id: string | null
          phone: string | null
          profile_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_signals_performance: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_rr: number
          simulated_return: number
          total_signals: number
          win_rate: number
        }[]
      }
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
      get_course_tree: {
        Args: { course_slug_or_id: string; requesting_user_id?: string }
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
      get_next_item: {
        Args: {
          p_course_id: string
          p_current_kind: string
          p_current_module_id: string
          p_current_position: number
        }
        Returns: Json
      }
      get_onboarding_step_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_time_spent_seconds: number
          completion_rate: number
          drop_off_rate: number
          step_name: string
          step_number: number
          total_completes: number
          total_exits: number
          total_views: number
        }[]
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
      is_admin: {
        Args: { uid: string }
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
      mark_lesson_complete: {
        Args: { lesson_id_param: string }
        Returns: Json
      }
      requires_mfa_for_operation: {
        Args: { _operation: string }
        Returns: boolean
      }
      save_quiz_attempt: {
        Args: { answers_param: Json; quiz_id_param: string }
        Returns: Json
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
      quiz_question_type: "single" | "multi" | "boolean" | "open"
      signal_source: "manual" | "mt5_ea" | "api"
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
      quiz_question_type: ["single", "multi", "boolean", "open"],
      signal_source: ["manual", "mt5_ea", "api"],
    },
  },
} as const
