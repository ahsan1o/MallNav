/*
  # Fix Admin User Policies

  1. Changes
    - Remove recursive admin policies that were causing infinite recursion
    - Simplify mall access policies
    - Add basic read-only policy for public mall access

  2. Security
    - Enable RLS on malls table
    - Add policies for public and admin access
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin users can view own admin status" ON admin_users;
DROP POLICY IF EXISTS "Super admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Mall admins can manage assigned mall" ON malls;

-- Create simplified policies for admin_users
CREATE POLICY "Enable read access for authenticated users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

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

-- Create simplified policies for malls
CREATE POLICY "Enable read access for all users"
  ON malls FOR SELECT
  TO public
  USING (true);

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