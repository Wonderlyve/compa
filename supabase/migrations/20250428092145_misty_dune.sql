/*
  # Create sermons database schema

  1. New Tables
    - `sermons` - Main table for sermon data
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `preacher` (text, not null)
      - `description` (text)
      - `category` (text, not null)
      - `audio_url` (text, not null)
      - `image_url` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    - `categories` - Table for sermon categories
      - `id` (uuid, primary key)
      - `name` (text, not null, unique)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on all tables
    - Add policy for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  preacher text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) NOT NULL,
  audio_url text NOT NULL,
  image_url text,
  duration integer, -- Duration in seconds
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create table for live radio streams
CREATE TABLE IF NOT EXISTS radio_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  stream_url text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_streams ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for categories" 
  ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access for sermons" 
  ON sermons FOR SELECT USING (true);

CREATE POLICY "Allow public read access for radio streams" 
  ON radio_streams FOR SELECT USING (true);

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Amour'),
  ('Sainteté'),
  ('Équilibre'),
  ('Puissance'),
  ('Développement'),
  ('Changement de Mentalité');