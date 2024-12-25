/*
  # Simplified Admin Access Policies

  1. Changes
    - Remove existing problematic policies
    - Create new simplified policies for admin_users and malls
    - Ensure proper access control for authenticated users and super admins
  
  2. Security
    - Enable basic read access for authenticated users
    - Restrict write operations to super admins
    - Maintain public read access for malls
*/

-- First, safely remove existing policies
DO $$ 
BEGIN
  -- Drop admin_users policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_users' 
    AND policyname = 'Admin users can view own admin status'
  ) THEN
    DROP POLICY "Admin users can view own admin status" ON admin_users;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_users' 
    AND policyname = 'Super admins can view all admin users'
  ) THEN
    DROP POLICY "Super admins can view all admin users" ON admin_users;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_users' 
    AND policyname = 'Super admins can manage admin users'
  ) THEN
    DROP POLICY "Super admins can manage admin users" ON admin_users;
  END IF;

  -- Drop malls policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'malls' 
    AND policyname = 'Mall admins can manage assigned mall'
  ) THEN
    DROP POLICY "Mall admins can manage assigned mall" ON malls;
  END IF;
END $$;

-- Create new policies one at a time
DO $$ 
BEGIN
  -- Policy for admin_users read access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_users' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON admin_users FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for admin_users insert access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_users' 
    AND policyname = 'Enable insert for authenticated super admins'
  ) THEN
    CREATE POLICY "Enable insert for authenticated super admins"
      ON admin_users FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE user_id = auth.uid()
          AND role = 'super_admin'
        )
      );
  END IF;

  -- Policy for admin_users update access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_users' 
    AND policyname = 'Enable update for authenticated super admins'
  ) THEN
    CREATE POLICY "Enable update for authenticated super admins"
      ON admin_users FOR UPDATE
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
  END IF;
END $$;

-- Create mall policies separately
DO $$ 
BEGIN
  -- Policy for malls read access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'malls' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON malls FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Policy for malls write access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'malls' 
    AND policyname = 'Enable write access for admin users'
  ) THEN
    CREATE POLICY "Enable write access for admin users"
      ON malls FOR ALL
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
  END IF;
END $$;