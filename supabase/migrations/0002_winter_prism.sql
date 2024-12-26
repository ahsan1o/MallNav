-- Clean up existing tables if they exist
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS mall_shops CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS malls CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create enum for admin roles
DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('super_admin', 'mall_admin', 'shop_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for shop categories if it doesn't exist
DO $$ BEGIN
  CREATE TYPE shop_category AS ENUM (
    'Fashion',
    'Electronics',
    'Food & Beverages',
    'Sports & Fitness',
    'Beauty & Health',
    'Books & Gifts',
    'Home & Living',
    'Entertainment'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create malls table
CREATE TABLE malls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  image_url text,
  contact_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shops table
CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category shop_category NOT NULL,
  image_url text,
  contact_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for mall-shop relationship
CREATE TABLE mall_shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mall_id uuid REFERENCES malls(id) ON DELETE CASCADE,
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  floor integer NOT NULL,
  coordinates jsonb NOT NULL, -- {lat: number, lng: number}
  position_3d jsonb NOT NULL, -- {x: number, y: number, z: number}
  created_at timestamptz DEFAULT now(),
  UNIQUE(mall_id, shop_id)
);

-- Create promotions table
CREATE TABLE promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mall_shop_id uuid REFERENCES mall_shops(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  discount_percentage integer CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (valid_until > valid_from)
);

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role admin_role NOT NULL,
  mall_id uuid REFERENCES malls(id), -- For mall admins
  mall_shop_id uuid REFERENCES mall_shops(id), -- For shop admins
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  CHECK (
    (role = 'super_admin' AND mall_id IS NULL AND mall_shop_id IS NULL) OR
    (role = 'mall_admin' AND mall_id IS NOT NULL AND mall_shop_id IS NULL) OR
    (role = 'shop_admin' AND mall_id IS NULL AND mall_shop_id IS NOT NULL)
  )
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  preferred_mall_id uuid REFERENCES malls(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE malls ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE mall_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for malls
CREATE POLICY "Public read access to malls"
  ON malls FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Super admin can manage malls"
  ON malls FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Mall admin can manage assigned mall"
  ON malls FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'mall_admin'
      AND mall_id = malls.id
    )
  );

-- Policies for shops
CREATE POLICY "Public read access to shops"
  ON shops FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Super admin can manage shops"
  ON shops FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Policies for mall_shops
CREATE POLICY "Public read access to mall_shops"
  ON mall_shops FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Super admin can manage mall_shops"
  ON mall_shops FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Mall admin can manage mall_shops for assigned mall"
  ON mall_shops FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'mall_admin'
      AND mall_id = mall_shops.mall_id
    )
  );

-- Policies for promotions
CREATE POLICY "Public read access to promotions"
  ON promotions FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "Super admin can manage promotions"
  ON promotions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Mall admin can manage promotions for assigned mall"
  ON promotions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users a
      JOIN mall_shops ms ON ms.mall_id = a.mall_id
      WHERE a.user_id = auth.uid()
      AND a.role = 'mall_admin'
      AND ms.id = promotions.mall_shop_id
    )
  );

CREATE POLICY "Shop admin can manage promotions for assigned shop"
  ON promotions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'shop_admin'
      AND mall_shop_id = promotions.mall_shop_id
    )
  );

-- Policies for admin_users
CREATE POLICY "Admins can view admin list"
  ON admin_users FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admin can manage admin_users"
  ON admin_users FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Mall admin can manage shop admins"
  ON admin_users FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users a1
      JOIN mall_shops ms ON ms.mall_id = a1.mall_id
      WHERE a1.user_id = auth.uid()
      AND a1.role = 'mall_admin'
      AND admin_users.role = 'shop_admin'
      AND admin_users.mall_shop_id = ms.id
    )
  );

-- Policies for user_profiles
CREATE POLICY "Users can manage their own profile"
  ON user_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_mall_id ON admin_users(mall_id);
CREATE INDEX idx_admin_users_mall_shop_id ON admin_users(mall_shop_id);
CREATE INDEX idx_mall_shops_mall_id ON mall_shops(mall_id);
CREATE INDEX idx_mall_shops_shop_id ON mall_shops(shop_id);
CREATE INDEX idx_promotions_mall_shop_id ON promotions(mall_shop_id);
CREATE INDEX idx_promotions_valid_until ON promotions(valid_until);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);