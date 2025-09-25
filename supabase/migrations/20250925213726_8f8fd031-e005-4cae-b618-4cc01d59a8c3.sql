-- Add missing foreign key constraints to maintain database consistency

-- Add FK for admin_users.user_id -> auth.users.id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'admin_users_user_id_fkey'
        AND table_name = 'admin_users'
    ) THEN
        ALTER TABLE public.admin_users 
        ADD CONSTRAINT admin_users_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add FK for affiliations.user_id -> auth.users.id  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'affiliations_user_id_fkey'
        AND table_name = 'affiliations'
    ) THEN
        ALTER TABLE public.affiliations 
        ADD CONSTRAINT affiliations_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add FK for course_events.user_id -> auth.users.id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'course_events_user_id_fkey'
        AND table_name = 'course_events'
    ) THEN
        ALTER TABLE public.course_events 
        ADD CONSTRAINT course_events_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add FK for posts.author_id -> auth.users.id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'posts_author_id_fkey'
        AND table_name = 'posts'
    ) THEN
        ALTER TABLE public.posts 
        ADD CONSTRAINT posts_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add FK for signals.author_id -> auth.users.id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'signals_author_id_fkey'
        AND table_name = 'signals'
    ) THEN
        ALTER TABLE public.signals 
        ADD CONSTRAINT signals_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add FK for signals.reviewer_id -> auth.users.id (nullable, SET NULL on delete)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'signals_reviewer_id_fkey'
        AND table_name = 'signals'
    ) THEN
        ALTER TABLE public.signals 
        ADD CONSTRAINT signals_reviewer_id_fkey 
        FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add performance indexes (regular indexes, not concurrent)
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliations_user_id ON public.affiliations(user_id);
CREATE INDEX IF NOT EXISTS idx_course_events_user_id ON public.course_events(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_signals_author_id ON public.signals(author_id);
CREATE INDEX IF NOT EXISTS idx_signals_reviewer_id ON public.signals(reviewer_id);