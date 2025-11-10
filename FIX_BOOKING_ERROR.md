# 🔧 URGENT FIX - Booking RLS Policy Error

## Problem
You're getting this error when trying to create a booking:
```
new row violates row-level security policy for table 'bookings'
```

## Root Cause
The Row Level Security (RLS) policy in Supabase is too restrictive and doesn't allow guest bookings (bookings without authentication).

## Solution (Choose ONE method)

### Method 1: Quick Fix via Supabase Dashboard (RECOMMENDED)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Login to your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Run This SQL Command**
   ```sql
   -- Drop the old restrictive policy
   DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
   
   -- Create new policy that allows both logged-in and guest bookings
   CREATE POLICY "Anyone can create bookings" 
       ON public.bookings FOR INSERT 
       WITH CHECK (
           (auth.uid() = user_id) OR 
           (user_id IS NULL)
       );
   ```

4. **Click "Run"** (or press Ctrl+Enter)

5. **Verify Success**
   - You should see a success message
   - Try creating a booking again

### Method 2: Run the SQL Script File

1. Open the file `fix-booking-policy.sql` (I just created it for you)
2. Copy all the contents
3. Go to Supabase Dashboard > SQL Editor
4. Paste and run the script

### Method 3: Disable RLS Temporarily (NOT RECOMMENDED FOR PRODUCTION)

Only use this for testing purposes:

```sql
-- TEMPORARY - Disable RLS on bookings table
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: This removes all security restrictions. Only use for testing!

## What Was Changed in the Code

I've already updated your code files:

1. ✅ **`js/supabase-config.js`** - Updated `createBooking()` function to properly handle guest bookings
2. ✅ **`js/booking-handler.js`** - Removed `user_id` from booking data preparation
3. ✅ **`booking.html`** - Made "Special Request" field optional
4. ✅ **`supabase-schema.sql`** - Updated schema for future reference

## Testing After Fix

### Test Case 1: Guest Booking (Not Logged In)
1. Don't login
2. Go to `booking.html`
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Mobile: +254712345678
   - Email: john@example.com
   - Check-in: Tomorrow
   - Check-out: 3 days from tomorrow
   - Adults: 2
   - Children: 0
4. Click "Book Now"
5. ✅ Should succeed with confirmation modal

### Test Case 2: Authenticated Booking (Logged In)
1. Login to your account
2. Go to `booking.html`
3. Notice fields are pre-filled
4. Select dates and guests
5. Click "Book Now"
6. ✅ Should succeed and you can see it in dashboard

## Verify in Supabase

After running the fix:

1. Go to **Table Editor** > **bookings**
2. Try to insert a row manually with `user_id = NULL`
3. It should work now

## Check Your Policy

Run this SQL to see your current policies:

```sql
SELECT 
    policyname,
    permissive,
    cmd,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings';
```

You should see:
- Policy Name: "Anyone can create bookings"
- Command: INSERT
- With Check: Contains logic for both authenticated and null user_id

## Still Having Issues?

### Error: "Permission denied for table bookings"
**Solution**: You need to enable RLS first:
```sql
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
```

### Error: "duplicate key value violates unique constraint"
**Solution**: The booking_number might be duplicate. This is rare but can happen:
```sql
-- Check for duplicates
SELECT booking_number, COUNT(*) 
FROM public.bookings 
GROUP BY booking_number 
HAVING COUNT(*) > 1;
```

### Error: "null value in column 'booking_number'"
**Solution**: The trigger might not be working. Recreate it:
```sql
-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_set_booking_number ON public.bookings;

CREATE TRIGGER trigger_set_booking_number
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_number();
```

## Additional Security Considerations

The new policy allows:
- ✅ **Authenticated users** to create bookings (user_id = their ID)
- ✅ **Guest users** to create bookings (user_id = NULL)
- ❌ **Users cannot create bookings** for other users
- ❌ **Malicious users cannot** assign bookings to others

This is secure because:
1. Users can only see their own bookings (SELECT policy unchanged)
2. Users can only update their own bookings (UPDATE policy unchanged)
3. Guest bookings have no owner but contain email for contact

## After Applying the Fix

You should be able to:
- ✅ Create bookings while logged in
- ✅ Create bookings as a guest
- ✅ See confirmation modal
- ✅ Receive booking number
- ✅ View bookings in dashboard (if logged in)

## Next Steps

1. **Apply the SQL fix** using Method 1 above
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try booking again** on your site
4. **Test both scenarios** (logged in and guest)

---

## Quick Command Summary

**To apply fix** (Copy and paste in Supabase SQL Editor):
```sql
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Anyone can create bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (
        (auth.uid() = user_id) OR 
        (user_id IS NULL)
    );
```

**That's it!** This should resolve your booking error immediately.

---

**Need more help?** Check the browser console (F12) for any additional errors after applying this fix.

**Last Updated**: November 10, 2025
