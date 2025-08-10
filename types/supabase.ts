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
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          password: string;
          role: string;
          supervisor_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          password: string;
          role?: string;
          supervisor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          password?: string;
          role?: string;
          supervisor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          nom: string;
          ville: string;
          contact: string;
          code_client: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          ville: string;
          contact: string;
          code_client: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          ville?: string;
          contact?: string;
          code_client?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      types_intervention: {
        Row: {
          id: string;
          nom: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      interventions: {
        Row: {
          id: string;
          titre: string;
          description: string;
          statut: string;
          priorite: string;
          date_debut: string | null;
          date_fin: string | null;
          client_id: string;
          technicien_id: string;
          type_id: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          description: string;
          statut?: string;
          priorite?: string;
          date_debut?: string | null;
          date_fin?: string | null;
          client_id: string;
          technicien_id: string;
          type_id: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titre?: string;
          description?: string;
          statut?: string;
          priorite?: string;
          date_debut?: string | null;
          date_fin?: string | null;
          client_id?: string;
          technicien_id?: string;
          type_id?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};