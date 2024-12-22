/*
  # Add more shops to malls

  1. New Shops
    - Add multiple shops for each mall with diverse categories
    - Include detailed shop information and locations
    - Add promotions for new shops

  2. Changes
    - Add shops to existing malls
    - Add promotions for new shops
    - Update shop coordinates and positions
*/

-- Add more shops for Mega Mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'JD Sports',
  'Premium sports fashion and footwear',
  'Sports & Fitness',
  2,
  '{"lat": 51.522, "lng": -0.107}',
  '{"x": -12, "y": 3, "z": 18}',
  'https://images.unsplash.com/photo-1519415943484-9fa1873496d4',
  id
FROM malls WHERE name = 'Mega Mall';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Waterstones',
  'Books, stationery and gifts',
  'Books & Gifts',
  1,
  '{"lat": 51.523, "lng": -0.108}',
  '{"x": 16, "y": 0, "z": 8}',
  'https://images.unsplash.com/photo-1526243741027-444d633d7365',
  id
FROM malls WHERE name = 'Mega Mall';

-- Add shops for Riverside Plaza
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'The Body Shop',
  'Natural beauty products and cosmetics',
  'Beauty & Health',
  1,
  '{"lat": 51.524, "lng": -0.109}',
  '{"x": -8, "y": 0, "z": 22}',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
  id
FROM malls WHERE name = 'Riverside Plaza';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Costa Coffee',
  'Premium coffee and snacks',
  'Food & Beverages',
  2,
  '{"lat": 51.525, "lng": -0.110}',
  '{"x": 20, "y": 3, "z": 12}',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0',
  id
FROM malls WHERE name = 'Riverside Plaza';

-- Add shops for Tech Hub Mall
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Currys',
  'Electronics and home appliances',
  'Electronics',
  1,
  '{"lat": 51.526, "lng": -0.111}',
  '{"x": -15, "y": 0, "z": 25}',
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
  id
FROM malls WHERE name = 'Tech Hub Mall';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Game',
  'Video games and gaming accessories',
  'Entertainment',
  2,
  '{"lat": 51.527, "lng": -0.112}',
  '{"x": 12, "y": 3, "z": 16}',
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf',
  id
FROM malls WHERE name = 'Tech Hub Mall';

-- Add shops for Fashion Avenue
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Pandora',
  'Jewelry and accessories',
  'Fashion',
  1,
  '{"lat": 51.528, "lng": -0.113}',
  '{"x": -10, "y": 0, "z": 20}',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
  id
FROM malls WHERE name = 'Fashion Avenue';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Swarovski',
  'Crystal jewelry and decorative items',
  'Fashion',
  1,
  '{"lat": 51.529, "lng": -0.114}',
  '{"x": 18, "y": 0, "z": 14}',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
  id
FROM malls WHERE name = 'Fashion Avenue';

-- Add new promotions
INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Summer Sports Event',
  'Get ready for summer with 25% off on selected items',
  25,
  now(),
  now() + interval '30 days'
FROM shops s
WHERE s.name = 'JD Sports';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Book Festival',
  'Buy one, get one half price on all books',
  50,
  now(),
  now() + interval '14 days'
FROM shops s
WHERE s.name = 'Waterstones';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Beauty Week',
  'Save 30% on skincare products',
  30,
  now(),
  now() + interval '21 days'
FROM shops s
WHERE s.name = 'The Body Shop';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Gaming Deals',
  'Trade in and save up to 40% on new games',
  40,
  now(),
  now() + interval '10 days'
FROM shops s
WHERE s.name = 'Game';