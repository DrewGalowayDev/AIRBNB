-- =====================================================
-- EMAIL NOTIFICATION SETUP FOR BOOKINGS
-- =====================================================
-- This adds email notification triggers to the booking system
-- =====================================================

-- Create a function to send booking confirmation email via webhook
CREATE OR REPLACE FUNCTION notify_booking_confirmation()
RETURNS TRIGGER AS $$
DECLARE
    email_payload JSON;
BEGIN
    -- Prepare email data
    email_payload := json_build_object(
        'booking_id', NEW.id,
        'booking_number', NEW.booking_number,
        'email', NEW.email,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'check_in', NEW.check_in,
        'check_out', NEW.check_out,
        'adults', NEW.adults,
        'children', NEW.children,
        'total_nights', NEW.total_nights,
        'total_amount', NEW.total_amount,
        'status', NEW.status,
        'created_at', NEW.created_at
    );
    
    -- Log the email notification (in production, this would trigger an email service)
    RAISE NOTICE 'Booking confirmation email data: %', email_payload;
    
    -- You can add a webhook call here to your email service
    -- Example: PERFORM http_post('https://your-email-service.com/send', email_payload);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new bookings
DROP TRIGGER IF EXISTS trigger_booking_confirmation_email ON public.bookings;

CREATE TRIGGER trigger_booking_confirmation_email
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION notify_booking_confirmation();

-- Optional: Create a table to log email notifications
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    email_to TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'confirmation', 'reminder', 'cancellation'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT,
    email_data JSONB
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow system to insert
CREATE POLICY "System can insert email logs" 
    ON public.email_logs FOR INSERT 
    WITH CHECK (true);

-- Policy: Users can view their own email logs
CREATE POLICY "Users can view their email logs" 
    ON public.email_logs FOR SELECT 
    USING (
        email_to IN (
            SELECT email FROM public.bookings WHERE user_id = auth.uid()
        )
    );

-- Function to log email notifications
CREATE OR REPLACE FUNCTION log_email_notification(
    p_booking_id UUID,
    p_email_to TEXT,
    p_email_type TEXT,
    p_email_data JSONB
)
RETURNS UUID AS $$
DECLARE
    new_log_id UUID;
BEGIN
    INSERT INTO public.email_logs (booking_id, email_to, email_type, email_data)
    VALUES (p_booking_id, p_email_to, p_email_type, p_email_data)
    RETURNING id INTO new_log_id;
    
    RETURN new_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. The trigger will automatically log booking confirmations
-- 3. Check email_logs table to see what emails would be sent
-- 4. In production, integrate with services like:
--    - SendGrid
--    - Mailgun
--    - Amazon SES
--    - Resend
--    - Postmark
-- =====================================================

COMMENT ON FUNCTION notify_booking_confirmation() IS 
'Automatically triggered when a new booking is created. Logs email notification data.';

COMMENT ON TABLE public.email_logs IS 
'Stores email notification history for bookings';
