/*
  # Create expenses table and security policies

  1. New Tables
    - `expenses`
      - `id` (bigint, primary key)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `description` (text)
      - `category` (text)

  2. Security
    - Enable RLS on `expenses` table
    - Add policies for authenticated users to:
      - Read their own expenses
      - Insert their own expenses
      - Delete their own expenses
*/

CREATE TABLE expenses (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  category text NOT NULL
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own expenses
CREATE POLICY "Users can read own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own expenses
CREATE POLICY "Users can insert own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own expenses
CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX expenses_user_id_idx ON expenses(user_id);
CREATE INDEX expenses_created_at_idx ON expenses(created_at DESC);