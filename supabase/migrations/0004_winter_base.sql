/*
  # Add shops to malls

  1. New Shops
    - Add multiple shops for each mall
    - Each shop has proper category, location, and mall association
  
  2. Promotions
    - Add promotions for new shops
    - Ensure valid dates and reasonable discounts
*/

-- Add shops for Mega Mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'H&M',
  'Trendy fashion for everyone',
  'Fashion',
  1,
  '{"lat": 51.510, "lng": -0.095}',
  '{"x": 5, "y": 0, "z": 15}',
  'https://images.unsplash.com/photo-1481437156560-3205f6a55735',
  id
FROM malls WHERE name = 'Mega Mall';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Foot Locker',
  'Premium athletic footwear and apparel',
  'Sports & Fitness',
  2,
  '{"lat": 51.511, "lng": -0.096}',
  '{"x": -8, "y": 3, "z": 12}',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
  id
FROM malls WHERE name = 'Mega Mall';

-- Add shops for Riverside Plaza
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Sephora',
  'Beauty and cosmetics paradise',
  'Beauty & Health',
  1,
  '{"lat": 51.512, "lng": -0.097}',
  '{"x": 12, "y": 0, "z": 8}',
  'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a',
  id
FROM malls WHERE name = 'Riverside Plaza';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Uniqlo',
  'Essential casual wear',
  'Fashion',
  2,
  '{"lat": 51.513, "lng": -0.098}',
  '{"x": -6, "y": 3, "z": 18}',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  id
FROM malls WHERE name = 'Riverside Plaza';

-- Add shops for Tech Hub Mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Microsoft Store',
  'Experience the latest in Windows and Xbox',
  'Electronics',
  1,
  '{"lat": 51.514, "lng": -0.099}',
  '{"x": 10, "y": 0, "z": 20}',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4',
  id
FROM malls WHERE name = 'Tech Hub Mall';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Xiaomi',
  'Smart devices and accessories',
  'Electronics',
  1,
  '{"lat": 51.515, "lng": -0.100}',
  '{"x": -12, "y": 0, "z": 25}',
  'https://images.unsplash.com/photo-1551355738-1875b6664915',
  id
FROM malls WHERE name = 'Tech Hub Mall';

-- Add shops for Fashion Avenue
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Gucci',
  'Luxury fashion and accessories',
  'Fashion',
  1,
  '{"lat": 51.516, "lng": -0.101}',
  '{"x": 15, "y": 0, "z": 10}',
  'https://images.unsplash.com/photo-1551537482-f2075a1d41f2',
  id
FROM malls WHERE name = 'Fashion Avenue';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Louis Vuitton',
  'Premium luxury goods',
  'Fashion',
  1,
  '{"lat": 51.517, "lng": -0.102}',
  '{"x": -15, "y": 0, "z": 15}',
  'https://images.unsplash.com/photo-1549637642-90187f64f420',
  id
FROM malls WHERE name = 'Fashion Avenue';

-- Add promotions for new shops
INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Spring Collection Sale',
  'Up to 40% off on new arrivals',
  40,
  now(),
  now() + interval '21 days'
FROM shops s
WHERE s.name IN ('H&M', 'Uniqlo');

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Premium Beauty Event',
  'Get 25% off on luxury beauty products',
  25,
  now(),
  now() + interval '14 days'
FROM shops s
WHERE s.name = 'Sephora';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Gaming Week',
  'Special discounts on Xbox consoles and games',
  20,
  now(),
  now() + interval '7 days'
FROM shops s
WHERE s.name = 'Microsoft Store';