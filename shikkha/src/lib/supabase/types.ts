/**
 * Database types for Supabase.
 *
 * This is a permissive placeholder that allows any table name and any row shape.
 * Replace with generated types once your Supabase project is up:
 *
 *   npx supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > src/lib/supabase/types.ts
 *
 * or for local dev:
 *
 *   npx supabase gen types typescript --local > src/lib/supabase/types.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AnyRow = Record<string, any>;

type AnyTable = {
  Row: AnyRow;
  Insert: AnyRow;
  Update: AnyRow;
  Relationships: [];
};

type TableProxy = {
  [key: string]: AnyTable;
};

export type Database = {
  public: {
    Tables: TableProxy;
    Views: { [key: string]: { Row: AnyRow } };
    Functions: { [key: string]: { Args: AnyRow; Returns: any } };
    Enums: { [key: string]: string };
    CompositeTypes: { [key: string]: AnyRow };
  };
};
