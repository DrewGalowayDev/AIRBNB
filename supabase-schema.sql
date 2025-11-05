-- =====================================================
-- LOFT CITY AIRBNB DATABASE SCHEMA FOR SUPABASE
-- =====================================================
-- Copy and paste this entire script into Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. APARTMENTS TABLE
-- =====================================================
CREATE TABLE public.apartments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    bedrooms INTEGER NOT NULL,
    max_guests INTEGER NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    location TEXT NOT NULL,
    amenities TEXT[], -- Array of amenities
    images TEXT[], -- Array of image URLs
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available apartments
CREATE POLICY "Anyone can view apartments" 
    ON public.apartments FOR SELECT 
    USING (true);

-- Insert default apartment
INSERT INTO public.apartments (name, description, bedrooms, max_guests, price_per_night, location, amenities, images)
VALUES (
    'Two-Bedroom Apartment in Kisumu',
    'A beautiful two-bedroom apartment located in the heart of Kisumu, Kenya. Perfect for families or groups looking for comfort and convenience.',
    2,
    6,
    5000.00,
    'Kisumu, Kenya',
    ARRAY['WiFi', 'Secure Parking', '24/7 Security', 'Kitchen', 'TV', 'Outdoor Garden', 'Hot Shower'],
    ARRAY['img/room/room-1.jpg', 'img/room/room-2.jpg', 'img/room/room-3.jpg']
);

-- =====================================================
-- 3. BOOKINGS TABLE
-- =====================================================
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    apartment_id UUID REFERENCES public.apartments(id) ON DELETE CASCADE,
    
    -- Guest Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Booking Details
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER NOT NULL DEFAULT 0,
    total_nights INTEGER NOT NULL,
    
    -- Pricing
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Booking Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    
    -- Special Requests
    special_request TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent double booking
    CONSTRAINT check_dates CHECK (check_out > check_in),
    CONSTRAINT valid_guests CHECK (adults > 0)
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view their own bookings" 
    ON public.bookings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own bookings" 
    ON public.bookings FOR UPDATE 
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_apartment_id ON public.bookings(apartment_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- =====================================================
-- 4. FAVORITES TABLE
-- =====================================================
CREATE TABLE public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    apartment_id UUID REFERENCES public.apartments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate favorites
    UNIQUE(user_id, apartment_id)
);

-- Enable Row Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policies for favorites
CREATE POLICY "Users can view their own favorites" 
    ON public.favorites FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" 
    ON public.favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
    ON public.favorites FOR DELETE 
    USING (auth.uid() = user_id);

-- =====================================================
-- 5. REVIEWS TABLE
-- =====================================================
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    apartment_id UUID REFERENCES public.apartments(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One review per booking
    UNIQUE(booking_id)
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Anyone can view reviews" 
    ON public.reviews FOR SELECT 
    USING (true);

CREATE POLICY "Users can create reviews for their bookings" 
    ON public.reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    year_part TEXT;
    sequence_part INTEGER;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number FROM 9) AS INTEGER)), 0) + 1
    INTO sequence_part
    FROM public.bookings
    WHERE booking_number LIKE 'BK-' || year_part || '-%';
    
    new_number := 'BK-' || year_part || '-' || LPAD(sequence_part::TEXT, 3, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking number
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
        NEW.booking_number := generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_number
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_number();

-- Function to calculate total nights
CREATE OR REPLACE FUNCTION calculate_total_nights()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_nights := NEW.check_out - NEW.check_in;
    NEW.total_amount := NEW.total_nights * NEW.price_per_night;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_total_nights
    BEFORE INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION calculate_total_nights();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apartments_updated_at
    BEFORE UPDATE ON public.apartments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. FUNCTION TO CHECK APARTMENT AVAILABILITY
-- =====================================================
CREATE OR REPLACE FUNCTION check_apartment_availability(
    p_apartment_id UUID,
    p_check_in DATE,
    p_check_out DATE
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM public.bookings
    WHERE apartment_id = p_apartment_id
        AND status IN ('confirmed', 'pending')
        AND (
            (check_in <= p_check_in AND check_out > p_check_in) OR
            (check_in < p_check_out AND check_out >= p_check_out) OR
            (check_in >= p_check_in AND check_out <= p_check_out)
        );
    
    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. VIEW FOR BOOKING STATISTICS
-- =====================================================
CREATE OR REPLACE VIEW user_booking_stats AS
SELECT 
    user_id,
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings
FROM public.bookings
GROUP BY user_id;

-- =====================================================
-- 9. FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, member_since)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SCHEMA CREATED SUCCESSFULLY!
-- =====================================================
-- Next steps:
-- 1. Copy this entire script
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run this script
-- 4. Configure your Supabase credentials in supabase-config.js
-- =====================================================
