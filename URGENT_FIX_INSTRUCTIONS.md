# 🚨 IMMEDIATE FIX NEEDED - Booking Error 401/42501

## ⚡ QUICK FIX (Do This Right Now)

### Step 1: Open Supabase
1. Go to https://supabase.com/dashboard
2. Select your project: `hexdqhqycavleqbbnndr`
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Copy & Paste This SQL

**OPTION A - Quick Temporary Fix:**
```sql
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
```

**OPTION B - Proper Fix (Recommended):**
```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create new policies that work
CREATE POLICY "bookings_insert_policy" 
    ON public.bookings FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "bookings_select_policy" 
    ON public.bookings FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "bookings_update_policy" 
    ON public.bookings FOR UPDATE 
    USING (auth.uid() = user_id);
```

### Step 3: Click "Run" Button

### Step 4: Test Your Booking
1. Go back to your website
2. Refresh the page (Ctrl + F5)
3. Try to create a booking
4. ✅ Should work now!

---

## 📸 Visual Guide

### Where to Find SQL Editor:
```
Supabase Dashboard
├── Your Project (hexdqhqycavleqbbnndr)
│   ├── Table Editor
│   ├── SQL Editor  👈 CLICK HERE
│   ├── Database
│   └── Authentication
```

### After Running SQL:
- You should see: ✅ "Success. No rows returned"
- If you see errors, copy them and send to me

---

## 🔍 Why This Happened

**Error Code 42501** means:
- "Row Level Security Policy Violation"
- Your database is blocking the insert
- The policy is too restrictive

**The Fix:**
- Removes old restrictive policies
- Creates new permissive policies
- Allows both guest and user bookings

---

## ✅ After Applying Fix

Test these scenarios:

### Test 1: Guest Booking (Not Logged In)
1. Don't login
2. Fill booking form
3. Submit
4. ✅ Should see confirmation modal

### Test 2: User Booking (Logged In)
1. Login first
2. Fill booking form
3. Submit
4. ✅ Should see confirmation
5. ✅ Should appear in dashboard

---

## 🆘 Still Not Working?

### Check Browser Console:
1. Press F12
2. Go to Console tab
3. Look for errors
4. Send me screenshot

### Check Supabase Logs:
1. In Supabase, go to "Logs"
2. Click "API"
3. Look for red errors
4. Send me screenshot

### Alternative Solution:
If SQL doesn't work, we can use Supabase Functions (serverless) to bypass RLS entirely.

---

## 📝 Copy-Paste Commands

**For Slack/Discord Support:**
```
Error: 42501 - Row Level Security Policy Violation
Table: public.bookings
Action: INSERT
Solution: Need to update RLS policies
```

**SQL to Run:**
```sql
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
```

---

## ⏱️ This Should Take:
- Reading: 2 minutes
- Running SQL: 30 seconds
- Testing: 1 minute
- **Total: ~4 minutes**

---

**DO THIS NOW and let me know if it works! 🚀**
