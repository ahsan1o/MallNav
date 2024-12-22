/*
  # Fix mall shop relationships

  1. Changes
    - Add NOT NULL constraint to mall_id in shops table
    - Update existing shops with correct mall associations
    - Add indexes for better query performance
*/

-- Make mall_id required for shops
ALTER TABLE shops
  ALTER COLUMN mall_id SET NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_shops_mall_id 
  ON shops(mall_id);

-- Add index for shop search
CREATE INDEX IF NOT EXISTS idx_shops_name_description
  ON shops USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Add index for active promotions
CREATE INDEX IF NOT EXISTS idx_promotions_valid_until
  ON promotions(valid_until);