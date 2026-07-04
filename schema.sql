-- Create the rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  daily_room_url TEXT NOT NULL,
  daily_room_name TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'waiting' NOT NULL -- waiting, active, finished
);

-- Enable RLS on the rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access to rooms
CREATE POLICY "Public Read Rooms" ON rooms FOR SELECT USING (true);

-- Allow public insert access to rooms
CREATE POLICY "Public Insert Rooms" ON rooms FOR INSERT WITH CHECK (true);

-- Allow public update access to rooms (needed to change status)
CREATE POLICY "Public Update Rooms" ON rooms FOR UPDATE USING (true);

-- Enable Realtime for the rooms table
alter publication supabase_realtime add table rooms;
-- Create the photos bucket
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict do nothing;

-- Set up storage policies for the photos bucket
-- Note: A SELECT policy is not needed for public buckets because files are accessed via getPublicUrl().
-- We only need an INSERT policy to allow uploading.

-- Allow public insert access (since we are not using authentication for this app)
create policy "Public Insert" on storage.objects for insert with check ( bucket_id = 'photos' );
