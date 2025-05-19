/*
  # Create todos table

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `completed` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `todos` table
    - Add policies for authenticated users to:
      - Read their own todos
      - Create new todos
      - Update their own todos
      - Delete their own todos
*/

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE
  ON todos
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();