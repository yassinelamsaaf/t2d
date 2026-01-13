-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create index for profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_email ON public.profiles(email);
-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Policy: Users can view all profiles (for verification)
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR
SELECT USING (true);
-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- Create tickets table
CREATE TABLE public.tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE NOT NULL,
    qr_code_data TEXT NOT NULL,
    checked_in BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create index for faster lookups
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_ticket_number ON public.tickets(ticket_number);
CREATE INDEX idx_tickets_checked_in ON public.tickets(checked_in);
-- Enable Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
-- Policy: Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON public.tickets FOR
SELECT USING (auth.uid() = user_id);
-- Policy: Users can insert their own tickets
CREATE POLICY "Users can insert own tickets" ON public.tickets FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Policy: Staff can view all tickets (we'll use a special role or service key)
-- For now, let's allow authenticated users to check ticket status
CREATE POLICY "Authenticated users can check tickets" ON public.tickets FOR
SELECT USING (auth.role() = 'authenticated');
-- Policy: Allow system to update check-in status (via service role)
CREATE POLICY "Service role can update tickets" ON public.tickets FOR
UPDATE USING (true);
-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = timezone('utc'::text, now());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger for updated_at on tickets
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- Create trigger for updated_at on profiles
CREATE TRIGGER set_profiles_updated_at BEFORE
UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ============================================
-- ADMIN ACCOUNT SETUP INSTRUCTIONS:
-- ============================================
-- After running the SQL above, you need to create the admin account:
-- 
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter:
--    - Email: t2d-admin@gmail.com
--    - Password: thinktodeployadmin@inpt
--    - Check "Auto Confirm User"
-- 4. Click "Create user"
-- 
-- Then run this SQL to add admin profile (replace USER_ID with the actual UUID):
-- 
-- INSERT INTO public.profiles (id, username, email, is_admin)
-- VALUES ('USER_ID_HERE', 'T2D Admin', 't2d-admin@gmail.com', true);
-- ============================================