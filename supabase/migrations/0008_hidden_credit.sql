/*
  # Add Mall Shops and Promotions

  1. New Data
    - Add shops for each mall
    - Add promotions for shops
    - Update existing shop relationships

  2. Changes
    - Add more sample shops with proper mall_id relationships
    - Add corresponding promotions for new shops
*/

-- Add more shops for each mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Adidas',
  'Sports and lifestyle products',
  'Sports & Fitness',
  1,
  '{"lat": 51.518, "lng": -0.103}',
  '{"x": 8, "y": 0, "z": 12}',
  'https://images.unsplash.com/photo-1518002171953-a080ee817e1f',
  id
FROM malls WHERE name = 'Mega Mall';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Muji',
  'Minimalist lifestyle products',
  'Home & Living',
  2,
  '{"lat": 51.519, "lng": -0.104}',
  '{"x": -10, "y": 3, "z": 16}',
  'https://images.unsplash.com/photo-1531384441138-2736e62e0919',
  id
FROM malls WHERE name = 'Mega Mall';

-- Add shops for Riverside Plaza
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Barnes & Noble',
  'Books and stationery',
  'Books & Gifts',
  1,
  '{"lat": 51.520, "lng": -0.105}',
  '{"x": 14, "y": 0, "z": 22}',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
  id
FROM malls WHERE name = 'Riverside Plaza';

-- Add shops for Tech Hub Mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Sony Store',
  'Premium electronics and entertainment',
  'Electronics',
  1,
  '{"lat": 51.521, "lng": -0.106}',
  '{"x": 18, "y": 0, "z": 14}',
  'https://images.unsplash.com/photo-1478827536114-da961b7f86d2',
  id
FROM malls WHERE name = 'Tech Hub Mall';

-- Add new promotions for the shops
INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Summer Sports Sale',
  'Get ready for summer with 30% off on selected items',
  30,
  now(),
  now() + interval '30 days'
FROM shops s
WHERE s.name = 'Adidas';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Home Essentials Deal',
  'Save 25% on home organization items',
  25,
  now(),
  now() + interval '21 days'
FROM shops s
WHERE s.name = 'Muji';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Book Lovers Week',
  'Buy 2 books, get 1 free',
  33,
  now(),
  now() + interval '14 days'
FROM shops s
WHERE s.name = 'Barnes & Noble';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Electronics Bonanza',
  'Up to 40% off on selected electronics',
  40,
  now(),
  now() + interval '10 days'
FROM shops s
WHERE s.name = 'Sony Store';