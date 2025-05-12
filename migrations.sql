-- NOTE: The backend of this project is already deployed to Supabase. However,
-- if the teaching team wishes to run the project on a local server, they can 
-- use the following steps to replicate the database. 

-- First, create the following table:

  CREATE TABLE IF NOT EXISTS public.profiles (
    id              uuid                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid,                                  -- legacy/nullable
    full_name       text                NOT NULL,
    graduation_year integer             NOT NULL,
    title           text                NOT NULL,
    employer        text                NOT NULL,
    location        text                NOT NULL,
    linkedin_url    text                NOT NULL,
    website_url     text,                                 -- optional
    resume_url      text                NOT NULL,
    about           text                NOT NULL,
    approved        boolean             NOT NULL DEFAULT false,
    created_at      timestamptz         NOT NULL DEFAULT now(),
    updated_at      timestamptz         DEFAULT now(),
    slug            text                NOT NULL,
    photo_url       text                NOT NULL,
    is_admin        boolean             NOT NULL DEFAULT false
  );

-- Second, enable row-level security on the profiles table

  ALTER TABLE public.profiles
    ENABLE ROW LEVEL SECURITY;

-- Third, create policies for your tables:

  CREATE POLICY "Allow inserts to profiles"
    ON public.profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);

  CREATE POLICY "Public: only approved profiles"
    ON public.profiles
    FOR SELECT
    TO anon,authenticated
    USING (approved = true);

  CREATE POLICY "Service role: full access on profiles"
    ON public.profiles
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);

  CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO public
    USING (auth.uid() = user_id);

-- Fourth, create the articles database:

  CREATE TABLE IF NOT EXISTS public.profiles (
    id              uuid                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid,                                 -- legacy nullable
    full_name       text                NOT NULL,
    graduation_year integer             NOT NULL,
    title           text                NOT NULL,
    employer        text                NOT NULL,
    location        text                NOT NULL,
    linkedin_url    text                NOT NULL,
    website_url     text,                                 -- optional
    resume_url      text                NOT NULL,
    about           text                NOT NULL,
    approved        boolean             NOT NULL DEFAULT false,
    created_at      timestamptz         NOT NULL DEFAULT now(),
    updated_at      timestamptz         DEFAULT now(),
    slug            text                NOT NULL,
    photo_url       text                NOT NULL,
    is_admin        boolean             NOT NULL DEFAULT false
  );

  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow inserts to profiles"
    ON public.profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);

  CREATE POLICY "Public: only approved profiles"
    ON public.profiles
    FOR SELECT
    TO anon,authenticated
    USING (approved = true);

  CREATE POLICY "Service role: full access on profiles"
    ON public.profiles
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);

  CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.articles (
  id           uuid                PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    uuid                NOT NULL REFERENCES public.profiles(id),
  author_name  text                NOT NULL,
  title        text                NOT NULL,
  excerpt      text,
  content      text                NOT NULL,
  image_url    text,
  date         date                NOT NULL,
  category     text                NOT NULL,
  featured     boolean             NOT NULL DEFAULT false,
  created_at   timestamptz         NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth INSERT on articles"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Auth SELECT on articles"
  ON public.articles
  FOR SELECT
  TO authenticated,anon
  USING (true);

CREATE POLICY "Auth UPDATE on articles"
  ON public.articles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Auth DELETE on articles"
  ON public.articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Service role: full access on articles"
  ON public.articles
  FOR ALL
  TO postgres
  USING (true)
  WITH CHECK (true);

-- Lastly, create two buckets via Storage UI: "photos" and "resumes".
-- Then apply your existing storage RLS policies in the SQL editor or UI.
