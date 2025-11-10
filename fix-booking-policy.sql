-- =====================================================
-- FIX BOOKING RLS POLICY
-- =====================================================
-- Run this in your Supabase SQL Editor to fix the booking policy
-- This allows both authenticated and guest bookings
-- =====================================================

-- Drop the old policy
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

-- Create new policy that allows guest bookings
CREATE POLICY "Anyone can create bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (
        (auth.uid() = user_id) OR 
        (user_id IS NULL)
    );

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings';
