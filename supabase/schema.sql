-- Glyphd Database Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  builder_points INTEGER DEFAULT 0
);

-- Marks (formerly Symbols)
CREATE TABLE IF NOT EXISTS marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  headline TEXT,
  sub TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  private BOOLEAN DEFAULT false,
  feed_posted BOOLEAN DEFAULT false,
  feed_posted_at TIMESTAMP WITH TIME ZONE,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  collab_requests INTEGER DEFAULT 0,
  hero_image_url TEXT,
  metadata JSONB,
  schema_data JSONB
);

-- Mark sections
CREATE TABLE IF NOT EXISTS mark_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mark_id UUID REFERENCES marks(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'features', 'pricing', 'testimonials', etc.
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mark files (images, assets)
CREATE TABLE IF NOT EXISTS mark_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mark_id UUID REFERENCES marks(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'document', etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feed/Social
CREATE TABLE IF NOT EXISTS feed_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mark_id UUID REFERENCES marks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mark_id, user_id)
);

CREATE TABLE IF NOT EXISTS feed_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mark_id UUID REFERENCES marks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collab_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mark_id UUID REFERENCES marks(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collab_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mark_id UUID REFERENCES marks(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES profiles(id),
  current_turn_user_id UUID REFERENCES profiles(id),
  turn_index INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS marks_author_idx ON marks(author_id);
CREATE INDEX IF NOT EXISTS marks_slug_idx ON marks(slug);
CREATE INDEX IF NOT EXISTS marks_private_idx ON marks(private);
CREATE INDEX IF NOT EXISTS marks_created_idx ON marks(created_at DESC);
CREATE INDEX IF NOT EXISTS mark_files_mark_idx ON mark_files(mark_id);
CREATE INDEX IF NOT EXISTS feed_likes_mark_idx ON feed_likes(mark_id);
CREATE INDEX IF NOT EXISTS feed_comments_mark_idx ON feed_comments(mark_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marks_updated_at BEFORE UPDATE ON marks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Marks: public marks visible to all, authors can edit own
CREATE POLICY "Public marks are viewable by everyone" ON marks
  FOR SELECT USING (NOT private OR author_id = auth.uid());

CREATE POLICY "Users can insert their own marks" ON marks
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own marks" ON marks
  FOR UPDATE USING (auth.uid() = author_id);

-- Feed interactions: all can read/write
CREATE POLICY "Anyone can view likes" ON feed_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create likes" ON feed_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON feed_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON feed_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');


