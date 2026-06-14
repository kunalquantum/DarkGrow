// Core domain types for Life OS.
// These mirror the Postgres schema defined in supabase/migrations/0001_init.sql

export type LifeObjectType =
  | "idea"
  | "project"
  | "goal"
  | "learning"
  | "decision"
  | "reflection"
  | "achievement"
  | "event"
  | "habit"
  | "note";

export type LifeObjectStatus =
  | "new"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "archived";

export type RelationshipType =
  | "related_to"
  | "created_from"
  | "supports"
  | "depends_on"
  | "inspired_by"
  | "resulted_in";

export type ActivityAction =
  | "created"
  | "updated"
  | "status_changed"
  | "progress_updated"
  | "paused"
  | "resumed"
  | "completed"
  | "cancelled"
  | "archived"
  | "relationship_added"
  | "relationship_removed"
  | "deleted";

export type LifeObject = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: LifeObjectType;
  status: LifeObjectStatus;
  progress: number;
  tags: string[];
  importance: number | null;
  energy: number | null;
  notes: string | null;
  start_date: string | null;
  target_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
};

export type LifeObjectRelationship = {
  id: string;
  user_id: string;
  from_object_id: string;
  to_object_id: string;
  relationship_type: RelationshipType;
  created_at: string;
};

export type ActivityHistoryEntry = {
  id: string;
  user_id: string;
  life_object_id: string | null;
  action: ActivityAction;
  field_changed: string | null;
  old_value: string | null;
  new_value: string | null;
  summary: string | null;
  created_at: string;
};

export type DailyReflection = {
  id: string;
  user_id: string;
  reflection_date: string;
  content: string;
  mood: number | null;
  created_at: string;
  updated_at: string;
};

export const LIFE_OBJECT_TYPES: LifeObjectType[] = [
  "idea",
  "project",
  "goal",
  "learning",
  "decision",
  "reflection",
  "achievement",
  "event",
  "habit",
  "note",
];

export const LIFE_OBJECT_STATUSES: LifeObjectStatus[] = [
  "new",
  "active",
  "paused",
  "completed",
  "cancelled",
  "archived",
];

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  "related_to",
  "created_from",
  "supports",
  "depends_on",
  "inspired_by",
  "resulted_in",
];

export type Database = {
  public: {
    Tables: {
      life_objects: {
        Row: LifeObject;
        Insert: Partial<LifeObject> & { title: string; user_id: string };
        Update: Partial<LifeObject>;
        Relationships: [];
      };
      life_object_relationships: {
        Row: LifeObjectRelationship;
        Insert: Partial<LifeObjectRelationship> & {
          from_object_id: string;
          to_object_id: string;
          user_id: string;
        };
        Update: Partial<LifeObjectRelationship>;
        Relationships: [];
      };
      activity_history: {
        Row: ActivityHistoryEntry;
        Insert: Partial<ActivityHistoryEntry> & {
          action: ActivityAction;
          user_id: string;
        };
        Update: Partial<ActivityHistoryEntry>;
        Relationships: [];
      };
      daily_reflections: {
        Row: DailyReflection;
        Insert: Partial<DailyReflection> & { content: string; user_id: string };
        Update: Partial<DailyReflection>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      life_object_type: LifeObjectType;
      life_object_status: LifeObjectStatus;
      relationship_type: RelationshipType;
      activity_action: ActivityAction;
    };
    CompositeTypes: Record<string, never>;
  };
};
