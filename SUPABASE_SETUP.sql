-- Create books table for MyShelf
CREATE TABLE IF NOT EXISTS public.books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  genre text NOT NULL,
  status text NOT NULL CHECK (status IN ('want_to_read', 'reading', 'read')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  cover_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read, no write - for single-user setup)
CREATE POLICY "books_are_public" ON public.books
  FOR SELECT USING (true);

-- Create storage bucket for covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT DO NOTHING;

-- Allow public read access to covers
CREATE POLICY "covers_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');
