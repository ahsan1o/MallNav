/*
  # Mall Management Schema

  1. New Tables
    - `malls`
      - Basic mall information
      - Location and contact details
    - `admin_users`
      - Admin user management
    - `user_profiles`
      - Extended user profile information
      
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user access
*/

-- Create malls table
CREATE TABLE IF NOT EXISTS malls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  image_url text,
  contact_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'mall_admin')),
  mall_id uuid REFERENCES malls,
  created_at timestamptz DEFAULT now()
);

-- Extend user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  preferred_mall_id uuid REFERENCES malls,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE malls ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for malls
CREATE POLICY "Public read access to malls"
  ON malls FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin users can manage malls"
  ON malls
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Policies for admin_users
CREATE POLICY "Admin users can view other admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage other admins"
  ON admin_users
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample mall
INSERT INTO malls (name, description, location, image_url) VALUES
('Central Mall', 'The premier shopping destination', 'Downtown', 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6'),
('Westside Shopping Center', 'Modern retail experience', 'West District', 'https://images.unsplash.com/photo-1567449303078-57ad995bd323'),
('East Plaza', 'Family-friendly mall', 'East District', 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f');

-- Add relationship between shops and malls
ALTER TABLE shops ADD COLUMN IF NOT EXISTS mall_id uuid REFERENCES malls;
UPDATE shops SET mall_id = (SELECT id FROM malls LIMIT 1);