export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      sermons: {
        Row: {
          id: string
          title: string
          preacher: string
          description: string | null
          category_id: string
          audio_url: string
          image_url: string | null
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          preacher: string
          description?: string | null
          category_id: string
          audio_url: string
          image_url?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          preacher?: string
          description?: string | null
          category_id?: string
          audio_url?: string
          image_url?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      radio_streams: {
        Row: {
          id: string
          title: string
          description: string | null
          stream_url: string
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          stream_url: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          stream_url?: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}