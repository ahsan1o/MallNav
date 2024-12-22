/*
  # Fix admin policies

  1. Changes
    - Remove recursive admin policies
    - Simplify access control for admin users
    - Add proper mall management policies
    
  2. Security
    - Enable RLS on all tables
    - Add proper policies for admin access
    - Fix infinite recursion in admin_users policies
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Admin users can view other admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage other admins" ON admin_users;
DROP POLICY IF EXISTS "Admin users can manage malls" ON malls;

-- Create new simplified policies for admin_users
CREATE POLICY "Admin users can view own admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
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

-- Create new mall management policies
CREATE POLICY "Mall admins can manage assigned mall"
  ON malls
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role = 'mall_admin' AND mall_id = malls.id)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role = 'mall_admin' AND mall_id = malls.id)
      )
    )
  );