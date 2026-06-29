export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      product_families: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_families"]["Insert"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          family_id: string;
          model: string;
          length_cm: number;
          width_cm: number;
          height_cm: number;
          thickness_cm: number;
          weight_kg: number;
          price: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          model: string;
          length_cm: number;
          width_cm: number;
          height_cm: number;
          thickness_cm?: number;
          weight_kg: number;
          price: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
        Relationships: [];
      };
      product_photos: {
        Row: {
          id: string;
          family_id: string;
          finish: string;
          image_url: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          finish: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_photos"]["Insert"]>;
        Relationships: [];
      };
      finishes: {
        Row: {
          id: string;
          name: string;
          hex: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          hex: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["finishes"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      contact_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          product_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          product_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_requests"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type ProductFamily = Database["public"]["Tables"]["product_families"]["Row"];
export type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductPhotoRow = Database["public"]["Tables"]["product_photos"]["Row"];
export type FinishRow = Database["public"]["Tables"]["finishes"]["Row"];
export type ContactRequest = Database["public"]["Tables"]["contact_requests"]["Row"];
