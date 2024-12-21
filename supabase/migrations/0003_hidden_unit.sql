/*
  # Add sample mall data

  1. New Data
    - Add sample malls with realistic data
    - Add sample shops for each mall
    - Add sample promotions for shops
*/

-- Insert more sample malls
INSERT INTO malls (name, description, location, image_url, contact_info) VALUES
('Mega Mall', 
 'A premier shopping destination with over 300 stores', 
 'Downtown District',
 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6',
 '{"phone": "+1-555-0123", "email": "info@megamall.com", "website": "https://megamall.com"}'
),
('Riverside Plaza', 
 'Waterfront shopping experience with scenic views', 
 'Riverside Area',
 'https://images.unsplash.com/photo-1567449303078-57ad995bd323',
 '{"phone": "+1-555-0124", "email": "contact@riversideplaza.com", "website": "https://riversideplaza.com"}'
),
('Tech Hub Mall', 
 'The ultimate destination for technology and gadgets', 
 'Innovation District',
 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f',
 '{"phone": "+1-555-0125", "email": "support@techhubmall.com", "website": "https://techhubmall.com"}'
),
('Fashion Avenue', 
 'Home to the most prestigious fashion brands', 
 'Fashion District',
 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
 '{"phone": "+1-555-0126", "email": "info@fashionavenue.com", "website": "https://fashionavenue.com"}'
);

-- Update existing shops with mall associations
UPDATE shops SET mall_id = (
  SELECT id FROM malls WHERE name = 'Mega Mall' LIMIT 1
) WHERE name IN ('Nike Store', 'Apple Store');

UPDATE shops SET mall_id = (
  SELECT id FROM malls WHERE name = 'Fashion Avenue' LIMIT 1
) WHERE name = 'Zara';

-- Insert new shops for different malls
INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Samsung Store',
  'Experience the latest Samsung devices and technology',
  'Electronics',
  1,
  '{"lat": 51.508, "lng": -0.093}',
  '{"x": 15, "y": 0, "z": 10}',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  id
FROM malls WHERE name = 'Tech Hub Mall';

INSERT INTO shops (name, description, category, floor, coordinates, position_3d, image_url, mall_id)
SELECT 
  'Starbucks',
  'Premium coffee and snacks',
  'Food & Beverages',
  2,
  '{"lat": 51.509, "lng": -0.094}',
  '{"x": -10, "y": 3, "z": 25}',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
  id
FROM malls WHERE name = 'Riverside Plaza';

-- Add new promotions
INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Tech Week Sale',
  'Amazing discounts on latest gadgets',
  25,
  now(),
  now() + interval '14 days'
FROM shops s
JOIN malls m ON s.mall_id = m.id
WHERE m.name = 'Tech Hub Mall';

INSERT INTO promotions (shop_id, title, description, discount_percentage, valid_from, valid_until)
SELECT 
  s.id,
  'Coffee Happy Hour',
  'Get 15% off between 2 PM and 5 PM',
  15,
  now(),
  now() + interval '30 days'
FROM shops s
WHERE s.name = 'Starbucks';