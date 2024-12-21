/*
  # Initial Schema Setup for Mall Navigator

  1. New Tables
    - `shops`
      - Basic shop information
      - Location data (2D and 3D coordinates)
      - Categories and metadata
    - `promotions`
      - Shop promotions/discounts
      - Validity periods
    - `categories`
      - Shop categories
    - `user_preferences`
      - User settings and preferences
      
  2. Security
    - Enable RLS on all tables
    - Public read access for shops, promotions, categories
    - Authenticated access for user preferences
*/

-- Create enum for shop categories
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

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category shop_category NOT NULL,
  floor integer NOT NULL,
  coordinates jsonb NOT NULL, -- For 2D map {lat: number, lng: number}
  position_3d jsonb NOT NULL, -- For 3D map {x: number, y: number, z: number}
  image_url text,
  opening_hours jsonb, -- Store hours for each day
  contact_info jsonb, -- Phone, email, website
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  discount_percentage integer,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  favorite_shops uuid[] DEFAULT '{}',
  preferred_categories shop_category[] DEFAULT '{}',
  notification_settings jsonb DEFAULT '{"deals": true, "favorites": true, "nearby": true}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to shops"
  ON shops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to promotions"
  ON promotions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert dummy shops
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url) VALUES
('Nike Store', 'Premium athletic footwear and sportswear', 'Sports & Fitness', 1, 
  '{"lat": 51.505, "lng": -0.09}', 
  '{"x": 10, "y": 0, "z": 5}',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
),
('Apple Store', 'Latest Apple products and accessories', 'Electronics', 1,
  '{"lat": 51.507, "lng": -0.092}',
  '{"x": 0, "y": 0, "z": 20}',
  'https://images.unsplash.com/photo-1491933382434-500287f9b54b'
),
('Zara', 'Contemporary fashion for men and women', 'Fashion', 2,
  '{"lat": 51.506, "lng": -0.091}',
  '{"x": -5, "y": 3, "z": 15}',
  'https://images.unsplash.com/photo-1445205170230-053b83016050'
);

-- Insert dummy promotions
INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until) 
SELECT 
  id as shop_id,
  'Spring Sale',
  'Get up to 30% off on selected items',
  30,
  now(),
  now() + interval '30 days'
FROM shops
WHERE name = 'Nike Store';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  id as shop_id,
  'New Collection Discount',
  'Save 20% on new arrivals',
  20,
  now(),
  now() + interval '15 days'
FROM shops
WHERE name = 'Zara';