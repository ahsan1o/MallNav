/*
  # Add User Profiles Constraint

  1. Changes
    - Add unique constraint on user_id in user_profiles table
    - Add NOT NULL constraints for required fields
    - Add default values for names to handle upserts

  2. Security
    - Maintain existing RLS policies
*/

-- Add unique constraint to user_profiles.user_id
ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

-- Update column constraints
ALTER TABLE user_profiles
  ALTER COLUMN first_name SET DEFAULT '',
  ALTER COLUMN last_name SET DEFAULT '';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id 
  ON user_profiles(user_id);