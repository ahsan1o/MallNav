/*
  # Fix shop relationships and data

  1. Changes
    - Add cascade delete for mall_id foreign key
    - Ensure all shops have valid mall_id references
    - Add more sample shops with proper relationships
*/

-- Update foreign key constraint to cascade
ALTER TABLE shops
  DROP CONSTRAINT IF EXISTS shops_mall_id_fkey,
  ADD CONSTRAINT shops_mall_id_fkey 
    FOREIGN KEY (mall_id) 
    REFERENCES malls(id) 
    ON DELETE CASCADE;

-- Insert more sample shops for each mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Zara Home',
  'Stylish home decor and textiles',
  'Home & Living',
  2,
  '{"lat": 51.530, "lng": -0.115}',
  '{"x": -14, "y": 3, "z": 22}',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace',
  id
FROM malls 
WHERE name = 'Mega Mall'
AND NOT EXISTS (
  SELECT 1 FROM shops 
  WHERE mall_id = malls.id 
  AND name = 'Zara Home'
);

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Lush',
  'Fresh handmade cosmetics',
  'Beauty & Health',
  1,
  '{"lat": 51.531, "lng": -0.116}',
  '{"x": 16, "y": 0, "z": 18}',
  'https://images.unsplash.com/photo-1601612628452-9e99ced43524',
  id
FROM malls 
WHERE name = 'Riverside Plaza'
AND NOT EXISTS (
  SELECT 1 FROM shops 
  WHERE mall_id = malls.id 
  AND name = 'Lush'
);

-- Add promotions for new shops
INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Home Makeover Sale',
  'Transform your space with 30% off home decor',
  30,
  now(),
  now() + interval '21 days'
FROM shops s
WHERE s.name = 'Zara Home';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Self-Care Special',
  'Buy any 3 items and get 1 free',
  25,
  now(),
  now() + interval '14 days'
FROM shops s
WHERE s.name = 'Lush';