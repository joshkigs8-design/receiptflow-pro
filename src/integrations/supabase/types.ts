export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string;
          category: string;
          created_at: string;
          id: string;
          landlord_id: string;
          property_id: string | null;
          title: string;
        };
        Insert: {
          body: string;
          category?: string;
          created_at?: string;
          id?: string;
          landlord_id?: string;
          property_id?: string | null;
          title: string;
        };
        Update: {
          body?: string;
          category?: string;
          created_at?: string;
          id?: string;
          landlord_id?: string;
          property_id?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          entity: string | null;
          entity_id: string | null;
          id: string;
          landlord_id: string;
        };
        Insert: {
          action: string;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: string;
          landlord_id?: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: string;
          landlord_id?: string;
        };
        Relationships: [];
      };
      leases: {
        Row: {
          created_at: string;
          document_url: string | null;
          end_date: string | null;
          id: string;
          landlord_id: string;
          signed: boolean;
          start_date: string | null;
          status: string;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          document_url?: string | null;
          end_date?: string | null;
          id?: string;
          landlord_id?: string;
          signed?: boolean;
          start_date?: string | null;
          status?: string;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          document_url?: string | null;
          end_date?: string | null;
          id?: string;
          landlord_id?: string;
          signed?: boolean;
          start_date?: string | null;
          status?: string;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leases_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_requests: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: string;
          landlord_id: string;
          photo_url: string | null;
          priority: string;
          property_id: string | null;
          status: string;
          tenant_id: string | null;
          unit_id: string | null;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description: string;
          id?: string;
          landlord_id?: string;
          photo_url?: string | null;
          priority?: string;
          property_id?: string | null;
          status?: string;
          tenant_id?: string | null;
          unit_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          landlord_id?: string;
          photo_url?: string | null;
          priority?: string;
          property_id?: string | null;
          status?: string;
          tenant_id?: string | null;
          unit_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maintenance_requests_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          landlord_id: string;
          read: boolean;
          title: string;
          type: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          landlord_id?: string;
          read?: boolean;
          title: string;
          type?: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          landlord_id?: string;
          read?: boolean;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          landlord_id: string;
          method: string;
          notes: string | null;
          paid_at: string;
          period_label: string | null;
          property_id: string | null;
          reference: string | null;
          status: string;
          tenant_id: string;
          unit_id: string | null;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          id?: string;
          landlord_id?: string;
          method?: string;
          notes?: string | null;
          paid_at?: string;
          period_label?: string | null;
          property_id?: string | null;
          reference?: string | null;
          status?: string;
          tenant_id: string;
          unit_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          landlord_id?: string;
          method?: string;
          notes?: string | null;
          paid_at?: string;
          period_label?: string | null;
          property_id?: string | null;
          reference?: string | null;
          status?: string;
          tenant_id?: string;
          unit_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          business_details: string | null;
          company_name: string;
          created_at: string;
          currency: string;
          full_name: string | null;
          id: string;
          logo_url: string | null;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          business_details?: string | null;
          company_name?: string;
          created_at?: string;
          currency?: string;
          full_name?: string | null;
          id: string;
          logo_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          business_details?: string | null;
          company_name?: string;
          created_at?: string;
          currency?: string;
          full_name?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          address: string | null;
          amenities: string[];
          code: string;
          created_at: string;
          description: string | null;
          gps_lat: number | null;
          gps_lng: number | null;
          id: string;
          image_url: string | null;
          landlord_id: string;
          name: string;
          notes: string | null;
          property_type: string;
          status: string;
          units_count: number;
        };
        Insert: {
          address?: string | null;
          amenities?: string[];
          code: string;
          created_at?: string;
          description?: string | null;
          gps_lat?: number | null;
          gps_lng?: number | null;
          id?: string;
          image_url?: string | null;
          landlord_id?: string;
          name: string;
          notes?: string | null;
          property_type?: string;
          status?: string;
          units_count?: number;
        };
        Update: {
          address?: string | null;
          amenities?: string[];
          code?: string;
          created_at?: string;
          description?: string | null;
          gps_lat?: number | null;
          gps_lng?: number | null;
          id?: string;
          image_url?: string | null;
          landlord_id?: string;
          name?: string;
          notes?: string | null;
          property_type?: string;
          status?: string;
          units_count?: number;
        };
        Relationships: [];
      };
      receipts: {
        Row: {
          amount: number;
          balance: number;
          created_at: string;
          id: string;
          issued_at: string;
          issued_by: string | null;
          landlord_id: string;
          payment_id: string | null;
          public_id: string;
          receipt_number: string;
          snapshot: Json;
          tenant_id: string | null;
        };
        Insert: {
          amount?: number;
          balance?: number;
          created_at?: string;
          id?: string;
          issued_at?: string;
          issued_by?: string | null;
          landlord_id?: string;
          payment_id?: string | null;
          public_id?: string;
          receipt_number: string;
          snapshot?: Json;
          tenant_id?: string | null;
        };
        Update: {
          amount?: number;
          balance?: number;
          created_at?: string;
          id?: string;
          issued_at?: string;
          issued_by?: string | null;
          landlord_id?: string;
          payment_id?: string | null;
          public_id?: string;
          receipt_number?: string;
          snapshot?: Json;
          tenant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "receipts_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "receipts_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      subscription_payments: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          id: string;
          paid_at: string | null;
          plan: string;
          reference: string;
          status: string;
          user_id: string;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          paid_at?: string | null;
          plan: string;
          reference: string;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          paid_at?: string | null;
          plan?: string;
          reference?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string;
          current_period_end: string | null;
          id: string;
          last_amount: number;
          last_reference: string | null;
          plan: string;
          status: string;
          trial_ends_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          last_amount?: number;
          last_reference?: string | null;
          plan?: string;
          status?: string;
          trial_ends_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          last_amount?: number;
          last_reference?: string | null;
          plan?: string;
          status?: string;
          trial_ends_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tenants: {
        Row: {
          created_at: string;
          deposit_paid: number;
          email: string | null;
          emergency_contact: string | null;
          full_name: string;
          id: string;
          landlord_id: string;
          lease_end: string | null;
          lease_start: string | null;
          national_id: string | null;
          notes: string | null;
          occupation: string | null;
          passport: string | null;
          phone: string;
          photo_url: string | null;
          property_id: string | null;
          rent_amount: number;
          status: string;
          unit_id: string | null;
        };
        Insert: {
          created_at?: string;
          deposit_paid?: number;
          email?: string | null;
          emergency_contact?: string | null;
          full_name: string;
          id?: string;
          landlord_id?: string;
          lease_end?: string | null;
          lease_start?: string | null;
          national_id?: string | null;
          notes?: string | null;
          occupation?: string | null;
          passport?: string | null;
          phone: string;
          photo_url?: string | null;
          property_id?: string | null;
          rent_amount?: number;
          status?: string;
          unit_id?: string | null;
        };
        Update: {
          created_at?: string;
          deposit_paid?: number;
          email?: string | null;
          emergency_contact?: string | null;
          full_name?: string;
          id?: string;
          landlord_id?: string;
          lease_end?: string | null;
          lease_start?: string | null;
          national_id?: string | null;
          notes?: string | null;
          occupation?: string | null;
          passport?: string | null;
          phone?: string;
          photo_url?: string | null;
          property_id?: string | null;
          rent_amount?: number;
          status?: string;
          unit_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tenants_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
        ];
      };
      units: {
        Row: {
          created_at: string;
          deposit: number;
          floor: string | null;
          id: string;
          image_url: string | null;
          landlord_id: string;
          notes: string | null;
          property_id: string;
          rent: number;
          room_number: string | null;
          status: string;
          unit_number: string;
          utilities: string | null;
        };
        Insert: {
          created_at?: string;
          deposit?: number;
          floor?: string | null;
          id?: string;
          image_url?: string | null;
          landlord_id?: string;
          notes?: string | null;
          property_id: string;
          rent?: number;
          room_number?: string | null;
          status?: string;
          unit_number: string;
          utilities?: string | null;
        };
        Update: {
          created_at?: string;
          deposit?: number;
          floor?: string | null;
          id?: string;
          image_url?: string | null;
          landlord_id?: string;
          notes?: string | null;
          property_id?: string;
          rent?: number;
          room_number?: string | null;
          status?: string;
          unit_number?: string;
          utilities?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      voucher_redemptions: {
        Row: {
          created_at: string;
          id: string;
          months: number;
          user_id: string;
          voucher_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          months?: number;
          user_id: string;
          voucher_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          months?: number;
          user_id?: string;
          voucher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "voucher_redemptions_voucher_id_fkey";
            columns: ["voucher_id"];
            isOneToOne: false;
            referencedRelation: "vouchers";
            referencedColumns: ["id"];
          },
        ];
      };
      vouchers: {
        Row: {
          active: boolean;
          code: string;
          created_at: string;
          created_by: string;
          expires_at: string | null;
          id: string;
          max_uses: number;
          months: number;
          note: string | null;
          updated_at: string;
          used_count: number;
        };
        Insert: {
          active?: boolean;
          code: string;
          created_at?: string;
          created_by?: string;
          expires_at?: string | null;
          id?: string;
          max_uses?: number;
          months?: number;
          note?: string | null;
          updated_at?: string;
          used_count?: number;
        };
        Update: {
          active?: boolean;
          code?: string;
          created_at?: string;
          created_by?: string;
          expires_at?: string | null;
          id?: string;
          max_uses?: number;
          months?: number;
          note?: string | null;
          updated_at?: string;
          used_count?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      redeem_voucher: { Args: { _code: string }; Returns: Json };
    };
    Enums: {
      app_role: "admin" | "landlord" | "tenant";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "landlord", "tenant"],
    },
  },
} as const;
