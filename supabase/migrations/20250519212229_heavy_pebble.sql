/*
  # Create recommended todos table

  1. New Tables
    - `recommended_todos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `recommended_todos` table
    - Add policies for authenticated users to:
      - Read recommended todos
      - Delete recommended todos
*/

CREATE TABLE IF NOT EXISTS recommended_todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommended_todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read recommended todos"
  ON recommended_todos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete recommended todos"
  ON recommended_todos
  FOR DELETE
  TO authenticated
  USING (true);