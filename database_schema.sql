-- =====================================================
-- MiniTok Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. PROFILES TABLE (replaces relying on auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. FOLLOWS TABLE (with RLS)
-- =====================================================
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- RLS Policies for follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
ON follows FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own follows"
ON follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
ON follows FOR DELETE
USING (auth.uid() = follower_id);


-- 3. USER STATS VIEW (performance optimization)
-- =====================================================
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  COALESCE(following.count, 0) AS following_count,
  COALESCE(followers.count, 0) AS followers_count,
  COALESCE(likes.count, 0) AS likes_count
FROM auth.users u
LEFT JOIN (
  SELECT follower_id, COUNT(*) as count
  FROM follows
  GROUP BY follower_id
) following ON following.follower_id = u.id
LEFT JOIN (
  SELECT following_id, COUNT(*) as count
  FROM follows
  GROUP BY following_id
) followers ON followers.following_id = u.id
LEFT JOIN (
  SELECT author, SUM(likes) as count
  FROM clips
  GROUP BY author
) likes ON likes.author = (
  SELECT username FROM profiles WHERE id = u.id
);


-- 4. LIKES TABLE (for tracking user likes)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  clip_id UUID REFERENCES clips(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, clip_id)
);

CREATE INDEX IF NOT EXISTS idx_user_likes_user ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_clip ON user_likes(clip_id);

-- RLS for user_likes
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
ON user_likes FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own likes"
ON user_likes FOR ALL
USING (auth.uid() = user_id);


-- 5. UPDATE CLIPS TABLE (add user_id)
-- =====================================================
ALTER TABLE clips ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_clips_user_id ON clips(user_id);


-- =====================================================
-- DONE! Your database is now production-ready
-- =====================================================
