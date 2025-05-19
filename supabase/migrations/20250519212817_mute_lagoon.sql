/*
  # Update recommended todos table

  1. Changes
    - Add user_id column to recommended_todos table
    - Insert initial recommended todos

  2. Security
    - Update RLS policies to check user_id
*/

-- Add user_id column
ALTER TABLE recommended_todos 
ADD COLUMN user_id uuid REFERENCES auth.users;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read recommended todos" ON recommended_todos;
DROP POLICY IF EXISTS "Users can delete recommended todos" ON recommended_todos;

-- Create new policies
CREATE POLICY "Users can read recommended todos"
  ON recommended_todos
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can delete recommended todos"
  ON recommended_todos
  FOR DELETE
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Insert initial recommended todos
INSERT INTO recommended_todos (title, user_id) VALUES
  ('Complete project documentation', '64e40ee9-099d-400b-b108-4254d4b65441'),
  ('Review code changes', '64e40ee9-099d-400b-b108-4254d4b65441'),
  ('Update test cases', '64e40ee9-099d-400b-b108-4254d4b65441');