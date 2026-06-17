-- DramaFlix Database Schema for Supabase (PostgreSQL)
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROVIDERS TABLE
-- =============================================
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  total_movies INTEGER DEFAULT 0,
  is_vip_only BOOLEAN DEFAULT FALSE,
  is_coming_soon BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_providers_active ON providers(is_active);

-- =============================================
-- MOVIES TABLE
-- =============================================
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  original_title VARCHAR(300),
  synopsis TEXT,
  cover_image_url TEXT,
  banner_image_url TEXT,
  country VARCHAR(50),
  status VARCHAR(20) DEFAULT 'Ongoing' CHECK (status IN ('Ongoing', 'Completed')),
  genre TEXT[] DEFAULT '{}',
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  provider_name VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  views INTEGER DEFAULT 0,
  total_episodes INTEGER DEFAULT 0,
  free_episodes INTEGER DEFAULT 0,
  year INTEGER,
  is_vip_only BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  category VARCHAR(20) DEFAULT 'drama' CHECK (category IN ('drama', 'movie', 'anime', 'donghua')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_movies_slug ON movies(slug);
CREATE INDEX idx_movies_provider ON movies(provider_id);
CREATE INDEX idx_movies_category ON movies(category);
CREATE INDEX idx_movies_trending ON movies(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_movies_new ON movies(is_new) WHERE is_new = TRUE;
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_year ON movies(year DESC);
CREATE INDEX idx_movies_rating ON movies(rating DESC);
CREATE INDEX idx_movies_views ON movies(views DESC);
CREATE INDEX idx_movies_genre ON movies USING GIN(genre);

-- Full text search index
CREATE INDEX idx_movies_search ON movies USING GIN(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(synopsis, ''))
);

-- =============================================
-- EPISODES TABLE
-- =============================================
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title VARCHAR(200),
  duration_minutes INTEGER DEFAULT 0,
  video_url TEXT,
  thumbnail_url TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  is_vip_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(movie_id, episode_number)
);

CREATE INDEX idx_episodes_movie ON episodes(movie_id);
CREATE INDEX idx_episodes_free ON episodes(is_free) WHERE is_free = TRUE;

-- =============================================
-- USERS TABLE (extends Supabase auth)
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  avatar_url TEXT,
  vip_plan VARCHAR(20),
  vip_expires_at TIMESTAMP WITH TIME ZONE,
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_vip ON user_profiles(vip_plan);
CREATE INDEX idx_user_profiles_referral ON user_profiles(referral_code);

-- =============================================
-- MY LIST (WATCHLIST) TABLE
-- =============================================
CREATE TABLE my_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

CREATE INDEX idx_my_list_user ON my_list(user_id);

-- =============================================
-- WATCH HISTORY TABLE
-- =============================================
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  last_episode INTEGER DEFAULT 1,
  progress_seconds INTEGER DEFAULT 0,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

CREATE INDEX idx_watch_history_user ON watch_history(user_id);

-- =============================================
-- VIP SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE vip_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(20) NOT NULL,
  plan_name VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_lifetime BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vip_subscriptions_user ON vip_subscriptions(user_id);
CREATE INDEX idx_vip_subscriptions_active ON vip_subscriptions(user_id)
  WHERE payment_status = 'paid' AND (expires_at > NOW() OR is_lifetime = TRUE);

-- =============================================
-- REFERRAL TRACKING TABLE
-- =============================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read providers" ON providers FOR SELECT USING (true);
CREATE POLICY "Public read movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Public read episodes" ON episodes FOR SELECT USING (true);

-- User profile policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- My list policies
CREATE POLICY "Users can manage own list" ON my_list FOR ALL USING (auth.uid() = user_id);

-- Watch history policies
CREATE POLICY "Users can manage own history" ON watch_history FOR ALL USING (auth.uid() = user_id);

-- VIP subscription policies
CREATE POLICY "Users can view own subscriptions" ON vip_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Referral policies
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'REF' || upper(substr(md5(random()::text), 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment view count
CREATE OR REPLACE FUNCTION increment_movie_views(movie_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE movies SET views = views + 1 WHERE id = movie_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
