-- =============================================
-- Social Footholds - Supabase Database Setup
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- NOTE: The 'profiles' table and its trigger should already exist
-- from the earlier auth setup. If not, uncomment the block below:

-- CREATE TABLE IF NOT EXISTS public.profiles (
--   id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
--   email text NOT NULL,
--   name text,
--   role text DEFAULT 'creator',
--   created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
-- );
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own profile" ON public.profiles
--   FOR SELECT USING (auth.uid() = id);
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, email, name, role)
--   VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'creator');
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============= SERVICES TABLE =============
CREATE TABLE IF NOT EXISTS public.services (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  pricing_type text NOT NULL,  -- per_view, subscription, per_project, package
  base_price float NOT NULL,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  icon text DEFAULT '',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone can read services
CREATE POLICY "Anyone can read services" ON public.services
  FOR SELECT USING (true);

-- Only service role (backend) can insert/update/delete
CREATE POLICY "Service role can manage services" ON public.services
  FOR ALL USING (auth.role() = 'service_role');

-- ============= SEED DEFAULT SERVICES =============
INSERT INTO public.services (id, name, description, pricing_type, base_price, features, icon) VALUES
  (gen_random_uuid()::text, 'Video Promotion', 'Boost your YouTube videos to reach more audience faster in your geography and niche', 'per_view', 10.0, '["Targeted audience reach", "Geography-specific promotion", "Niche-based targeting", "Fast delivery"]'::jsonb, 'video'),
  (gen_random_uuid()::text, 'Music Promotion', 'Promote your music on Spotify and Apple Music to gain more streams and followers', 'per_project', 299.0, '["Spotify promotion", "Apple Music promotion", "Playlist placement", "Organic growth"]'::jsonb, 'music'),
  (gen_random_uuid()::text, 'Channel SEO Optimization', 'Optimize your channel with dedicated SEO team to rank better in search results', 'subscription', 599.0, '["SEO optimization", "Real gain in watch time and subscribers", "Monetization growth"]'::jsonb, 'search'),
  (gen_random_uuid()::text, 'Video Editing', 'Professional video editing services for your YouTube content', 'per_project', 150.0, '["Cinematic Color Correction & Visual Grading", "Audio Engineering & Noise Reduction", "Seamless Transitions & Visual Flow"]'::jsonb, 'film'),
  (gen_random_uuid()::text, 'Shorts Creation', 'Create engaging shorts from your long-form videos with content ideas', 'package', 99.0, '["Long form to short form videos", "Content ideas", "Shorts editing"]'::jsonb, 'smartphone'),
  (gen_random_uuid()::text, 'Web Page & Blogs', 'Create professional web pages and blogs to enhance your online presence', 'per_project', 599.0, '["Landing page", "Blog writing", "Books/content selling website"]'::jsonb, 'globe')
ON CONFLICT (id) DO NOTHING;

-- ============= ORDERS TABLE =============
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id text NOT NULL REFERENCES public.services(id),
  service_name text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  amount float NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (backend uses service key)
CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');

-- ============= ENQUIRIES TABLE =============
CREATE TABLE IF NOT EXISTS public.enquiries (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  service text,
  channel_link text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Service role can manage enquiries
CREATE POLICY "Service role can manage enquiries" ON public.enquiries
  FOR ALL USING (auth.role() = 'service_role');

-- ============= BLOGS TABLE =============
CREATE TABLE IF NOT EXISTS public.blogs (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  author text NOT NULL,
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published blogs
CREATE POLICY "Anyone can read published blogs" ON public.blogs
  FOR SELECT USING (published = true);

-- Service role can manage all blogs
CREATE POLICY "Service role can manage blogs" ON public.blogs
  FOR ALL USING (auth.role() = 'service_role');
