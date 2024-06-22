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
      character: {
        Row: {
          createdAt: string;
          id: string;
          name: string;
          scriptId: string;
          summary: string | null;
          updatedAt: string | null;
        };
        Insert: {
          createdAt?: string;
          id: string;
          name: string;
          scriptId: string;
          summary?: string | null;
          updatedAt?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          name?: string;
          scriptId?: string;
          summary?: string | null;
          updatedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "character_scriptId_script_id_fk";
            columns: ["scriptId"];
            isOneToOne: false;
            referencedRelation: "script";
            referencedColumns: ["id"];
          },
        ];
      };
      character_assignment: {
        Row: {
          characterId: string;
          createdAt: string;
          id: string;
          readingId: string | null;
          updatedAt: string | null;
          userId: string;
        };
        Insert: {
          characterId: string;
          createdAt?: string;
          id: string;
          readingId?: string | null;
          updatedAt?: string | null;
          userId: string;
        };
        Update: {
          characterId?: string;
          createdAt?: string;
          id?: string;
          readingId?: string | null;
          updatedAt?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "character_assignment_characterId_character_id_fk";
            columns: ["characterId"];
            isOneToOne: false;
            referencedRelation: "character";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_assignment_readingId_reading_id_fk";
            columns: ["readingId"];
            isOneToOne: false;
            referencedRelation: "reading";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_assignment_userId_user_id_fk";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      element: {
        Row: {
          characterId: string;
          createdAt: string;
          id: string;
          index: number;
          metadata: Json | null;
          page: number;
          scene: number;
          scriptId: string;
          text: string;
          type: Database["public"]["Enums"]["elementType"];
          updatedAt: string | null;
        };
        Insert: {
          characterId: string;
          createdAt?: string;
          id: string;
          index: number;
          metadata?: Json | null;
          page: number;
          scene: number;
          scriptId: string;
          text: string;
          type: Database["public"]["Enums"]["elementType"];
          updatedAt?: string | null;
        };
        Update: {
          characterId?: string;
          createdAt?: string;
          id?: string;
          index?: number;
          metadata?: Json | null;
          page?: number;
          scene?: number;
          scriptId?: string;
          text?: string;
          type?: Database["public"]["Enums"]["elementType"];
          updatedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "element_characterId_character_id_fk";
            columns: ["characterId"];
            isOneToOne: false;
            referencedRelation: "character";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "element_scriptId_script_id_fk";
            columns: ["scriptId"];
            isOneToOne: false;
            referencedRelation: "script";
            referencedColumns: ["id"];
          },
        ];
      };
      reading: {
        Row: {
          createdAt: string;
          createdById: string;
          currentElementId: string | null;
          endedAt: string | null;
          id: string;
          scriptId: string;
          slug: string;
          startedAt: string | null;
          updatedAt: string | null;
        };
        Insert: {
          createdAt?: string;
          createdById: string;
          currentElementId?: string | null;
          endedAt?: string | null;
          id: string;
          scriptId: string;
          slug: string;
          startedAt?: string | null;
          updatedAt?: string | null;
        };
        Update: {
          createdAt?: string;
          createdById?: string;
          currentElementId?: string | null;
          endedAt?: string | null;
          id?: string;
          scriptId?: string;
          slug?: string;
          startedAt?: string | null;
          updatedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reading_createdById_user_id_fk";
            columns: ["createdById"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_currentElementId_element_id_fk";
            columns: ["currentElementId"];
            isOneToOne: false;
            referencedRelation: "element";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_scriptId_script_id_fk";
            columns: ["scriptId"];
            isOneToOne: false;
            referencedRelation: "script";
            referencedColumns: ["id"];
          },
        ];
      };
      reading_session: {
        Row: {
          createdAt: string;
          id: string;
          online: boolean;
          readingId: string | null;
          updatedAt: string | null;
          userId: string | null;
        };
        Insert: {
          createdAt?: string;
          id: string;
          online?: boolean;
          readingId?: string | null;
          updatedAt?: string | null;
          userId?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          online?: boolean;
          readingId?: string | null;
          updatedAt?: string | null;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reading_session_readingId_reading_id_fk";
            columns: ["readingId"];
            isOneToOne: false;
            referencedRelation: "reading";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_session_userId_user_id_fk";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      script: {
        Row: {
          basedOn: string | null;
          basedOnBy: string | null;
          createdAt: string;
          id: string;
          imageUrl: string | null;
          readingTime: number;
          title: string;
          updatedAt: string | null;
          writtenBy: string;
        };
        Insert: {
          basedOn?: string | null;
          basedOnBy?: string | null;
          createdAt?: string;
          id: string;
          imageUrl?: string | null;
          readingTime?: number;
          title: string;
          updatedAt?: string | null;
          writtenBy: string;
        };
        Update: {
          basedOn?: string | null;
          basedOnBy?: string | null;
          createdAt?: string;
          id?: string;
          imageUrl?: string | null;
          readingTime?: number;
          title?: string;
          updatedAt?: string | null;
          writtenBy?: string;
        };
        Relationships: [];
      };
      user: {
        Row: {
          avatarUrl: string | null;
          createdAt: string;
          email: string;
          firstName: string | null;
          id: string;
          lastName: string | null;
          online: boolean;
          updatedAt: string | null;
        };
        Insert: {
          avatarUrl?: string | null;
          createdAt?: string;
          email: string;
          firstName?: string | null;
          id: string;
          lastName?: string | null;
          online?: boolean;
          updatedAt?: string | null;
        };
        Update: {
          avatarUrl?: string | null;
          createdAt?: string;
          email?: string;
          firstName?: string | null;
          id?: string;
          lastName?: string | null;
          online?: boolean;
          updatedAt?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      elementType:
        | "action"
        | "dialog"
        | "scene"
        | "character"
        | "transition"
        | "parenthetical";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
