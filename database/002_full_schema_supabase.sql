CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,

  is_premium BOOLEAN DEFAULT FALSE,
  subscription_status TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_session_id TEXT UNIQUE,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,

  last_active_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  template_id TEXT NOT NULL DEFAULT 'professional',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,

  name TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  target_role TEXT,
  industry_focus TEXT,
  score_breakdown JSONB,

  ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
  ats_analysis JSONB DEFAULT '{}'::jsonb,

  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS resume_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  ats_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  preview_image_url TEXT,
  template_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE VIEW usage_statistics AS
SELECT
  user_id,
  (created_at AT TIME ZONE 'utc')::date AS usage_date,
  event_type AS action,
  COUNT(*)::int AS usage_count
FROM user_analytics
GROUP BY user_id, ((created_at AT TIME ZONE 'utc')::date), event_type;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active_at ON profiles(last_active_at DESC);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_template_id ON resumes(template_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_ats_score ON resumes(ats_score DESC);

CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_created_at ON resume_versions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON templates(is_premium);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_sort_order ON templates(sort_order);

CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own resumes" ON resumes;
CREATE POLICY "Users can create own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;
CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own resume versions" ON resume_versions;
CREATE POLICY "Users can view own resume versions" ON resume_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_versions.resume_id
      AND r.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create own resume versions" ON resume_versions;
CREATE POLICY "Users can create own resume versions" ON resume_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_versions.resume_id
      AND r.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can view active templates" ON templates;
CREATE POLICY "Anyone can view active templates" ON templates
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can view own analytics" ON user_analytics;
CREATE POLICY "Users can view own analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analytics" ON user_analytics;
CREATE POLICY "Users can insert own analytics" ON user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert analytics" ON user_analytics;
CREATE POLICY "Service role can insert analytics" ON user_analytics
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.log_usage(
  p_user_id UUID,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.user_analytics (user_id, event_type, event_data)
  VALUES (p_user_id, p_action, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_daily_usage_count(
  p_user_id UUID,
  p_action TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_start TIMESTAMPTZ;
  v_end TIMESTAMPTZ;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RETURN 0;
  END IF;

  v_start := date_trunc('day', timezone('utc'::text, now()));
  v_end := v_start + interval '1 day';

  SELECT COUNT(*)::int INTO v_count
  FROM public.user_analytics
  WHERE user_id = p_user_id
    AND event_type = p_action
    AND created_at >= v_start
    AND created_at < v_end;

  RETURN COALESCE(v_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_daily_limit(
  p_user_id UUID,
  p_action TEXT,
  p_limit INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used INTEGER;
BEGIN
  IF p_limit IS NULL OR p_limit < 0 THEN
    RETURN true;
  END IF;
  v_used := public.get_daily_usage_count(p_user_id, p_action);
  RETURN v_used < p_limit;
END;
$$;

INSERT INTO templates (id, name, description, category, is_premium, sort_order) VALUES
  ('professional', 'Professional', 'Clean and professional template perfect for corporate roles', 'business', false, 1),
  ('modern', 'Modern', 'Contemporary design with a fresh look', 'creative', false, 2),
  ('executive', 'Executive', 'Sophisticated template for senior positions', 'business', false, 3),
  ('creative', 'Creative', 'Bold and creative design for artistic roles', 'creative', true, 4),
  ('technical', 'Technical', 'Optimized for technical and engineering roles', 'technical', false, 5),
  ('executive-elite', 'Executive Elite', 'Premium template for C-level executives', 'business', true, 6),
  ('startup-founder', 'Startup Founder', 'Dynamic template for entrepreneurs', 'business', true, 7),
  ('designer-pro', 'Designer Pro', 'Premium template for design professionals', 'creative', true, 8)
ON CONFLICT (id) DO NOTHING;

