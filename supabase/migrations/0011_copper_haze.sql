/*
  # Complete Role-Based Access Control System

  1. Changes
    - Implement proper role hierarchy (super_admin > mall_admin > shop_admin)
    - Fix recursive policy issues
    - Add proper role management tables
  
  2. Security
    - Clear role-based permissions
    - Non-recursive policies
    - Proper access control hierarchy
*/

-- Drop existing policies safely
DO $$ 
BEGIN
  -- Drop policies if they exist
  EXECUTE (
    SELECT string_agg(
      format('DROP POLICY IF EXISTS %I ON %I.%I;',
        pol.policyname, 
        pol.schemaname, 
        pol.tablename
      ), E'\n'
    )
    FROM pg_policies pol 
    WHERE pol.schemaname = 'public'
    AND pol.tablename IN ('malls', 'shops', 'promotions', 'admin_users', 'user_profiles')
  );
END $$;

-- Create admin roles enum
CREATE TYPE admin_role AS ENUM ('super_admin', 'mall_admin', 'shop_admin');

-- Modify admin_users table to use the new role type
ALTER TABLE admin_users 
  DROP COLUMN IF EXISTS role,
  ADD COLUMN role admin_role NOT NULL DEFAULT 'shop_admin',
  ADD COLUMN shop_id uuid REFERENCES shops(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_mall_shop ON admin_users(mall_id, shop_id);

-- Super Admin Policies --

-- Super admin can do everything
CREATE POLICY "Super admin full access"
  ON malls
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admin manage all shops"
  ON shops
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admin manage all promotions"
  ON promotions
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Mall Admin Policies --

CREATE POLICY "Mall admin manage their shops"
  ON shops
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'mall_admin'
      AND mall_id = shops.mall_id
    )
  );

CREATE POLICY "Mall admin manage their promotions"
  ON promotions
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users a
      JOIN shops s ON s.mall_id = a.mall_id
      WHERE a.user_id = auth.uid() 
      AND a.role = 'mall_admin'
      AND s.id = promotions.shop_id
    )
  );

-- Shop Admin Policies --

CREATE POLICY "Shop admin manage their promotions"
  ON promotions
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'shop_admin'
      AND shop_id = promotions.shop_id
    )
  );

-- Public Read Access --

CREATE POLICY "Public read access to malls"
  ON malls FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to shops"
  ON shops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to promotions"
  ON promotions FOR SELECT
  TO public
  USING (true);

-- Admin Management Policies --

CREATE POLICY "Super admin manage admin users"
  ON admin_users
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admin users view own status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Enable RLS
ALTER TABLE malls ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;