# Quick Start Guide - Booking System

## 🚀 Getting Started

### Step 1: Verify Supabase Connection
1. Open `js/supabase-config.js`
2. Confirm your credentials are set:
   ```javascript
   const SUPABASE_URL = 'https://hexdqhqycavleqbbnndr.supabase.co'
   const SUPABASE_ANON_KEY = 'your-key-here'
   ```

### Step 2: Test the Booking Flow

#### For Users
1. **Visit the Site**: Open `index.html` in your browser
2. **Create Account**: 
   - Go to `login.html`
   - Click "Sign Up"
   - Fill in your details
   - Submit form
3. **Make a Booking**:
   - Go to `booking.html`
   - Notice your info is pre-filled (if logged in)
   - Select check-in and check-out dates
   - Choose number of guests
   - Add special requests (optional)
   - Click "Book Now"
   - See confirmation modal with booking number
4. **View Dashboard**:
   - Go to `dashboard.html` (or click from confirmation)
   - See your booking listed
   - View booking statistics
   - Check your profile information

#### For Guests (Not Logged In)
1. Go to `booking.html`
2. Fill in all information manually
3. Complete booking
4. Receive confirmation (no dashboard access)

### Step 3: Test Key Features

#### ✅ Calendar Functionality
- [ ] Open booking form
- [ ] Click on check-in date field
- [ ] Try to select a past date (should be disabled)
- [ ] Select today or future date
- [ ] Check that checkout minimum date updates
- [ ] Fill in other fields
- [ ] Verify no refresh occurs while typing

#### ✅ Form Data Persistence
- [ ] Start filling the form
- [ ] Refresh the page (Ctrl+R / Cmd+R)
- [ ] Form data should be restored
- [ ] Complete and submit booking
- [ ] Refresh again - form should be empty

#### ✅ Dashboard Real Data
- [ ] Login to your account
- [ ] Go to dashboard
- [ ] Verify your name appears in welcome message
- [ ] Check statistics show your booking count
- [ ] See your actual bookings listed
- [ ] Click "View Details" on a booking
- [ ] Try to cancel a pending/confirmed booking

## 🔧 Configuration

### Required Files Structure
```
/AIRBNB
  /js
    ├── supabase-config.js     ✅ (Configured)
    ├── booking-handler.js      ✅ (Updated)
    ├── booking.js              ✅ (Updated)
    ├── dashboard.js            ✅ (Updated)
    ├── auth.js                 ✅ (Working)
    └── main.js                 ✅ (Updated)
  
  ├── booking.html              ✅ (Updated)
  ├── dashboard.html            ✅ (Updated)
  ├── login.html               ✅ (Working)
  └── index.html               ✅ (Working)
```

### Database Setup
Your Supabase database should have these tables:
- ✅ `profiles` - User information
- ✅ `apartments` - Property listings
- ✅ `bookings` - Reservation records
- ✅ `favorites` - User favorites
- ✅ `reviews` - User reviews

## 🐛 Troubleshooting

### Problem: Form fields are refreshing
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Del)
2. Do a hard refresh (Ctrl+F5)
3. Check console for errors

### Problem: Dashboard not loading data
**Solution**:
1. Check if you're logged in
2. Open browser console (F12)
3. Look for any red error messages
4. Verify Supabase credentials
5. Check your internet connection

### Problem: Cannot create booking
**Solution**:
1. Ensure dates are in the future
2. Check-out must be after check-in
3. Fill all required fields
4. Check console for specific error

### Problem: Dates showing wrong format
**Solution**:
1. Your browser may not support HTML5 date input
2. Try a modern browser (Chrome, Firefox, Edge)
3. Update your browser to latest version

## 📱 Browser Support

### ✅ Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Chrome/Safari

### ⚠️ Limited Support
- IE 11 and below (not recommended)
- Very old mobile browsers

## 🔑 Key Features

### Booking System
- ✅ Real-time availability checking
- ✅ Automatic price calculation
- ✅ Prevents double bookings
- ✅ Guest count validation
- ✅ Date range validation
- ✅ Mobile-friendly date picker
- ✅ Form data auto-save

### Dashboard
- ✅ Real-time booking statistics
- ✅ Booking management
- ✅ Profile information
- ✅ Booking cancellation
- ✅ Booking details modal
- ✅ Quick action buttons

### Authentication
- ✅ Email/password signup
- ✅ Secure login
- ✅ Session management
- ✅ Auto-redirect when logged in
- ✅ Protected routes

## 📊 Monitoring

### Check Booking Creation
1. Login to Supabase Dashboard
2. Go to Table Editor
3. Click on "bookings" table
4. See newly created bookings

### Check User Statistics
1. Go to SQL Editor in Supabase
2. Run: `SELECT * FROM user_booking_stats;`
3. View aggregated statistics

### Check Logs
1. Go to Logs in Supabase
2. Select "API" logs
3. Filter by errors if needed

## 🎯 Testing Scenarios

### Scenario 1: New User Booking
1. Create new account
2. Verify email (check Supabase auth)
3. Go to booking page
4. Fill form with data:
   - Check-in: Tomorrow
   - Check-out: 3 days from tomorrow
   - Adults: 2
   - Children: 1
5. Submit booking
6. Check confirmation modal
7. Go to dashboard
8. Verify booking appears

### Scenario 2: Repeat Booking
1. Login to existing account
2. Go to booking page
3. Notice pre-filled information
4. Select different dates
5. Submit booking
6. Go to dashboard
7. Should see both bookings

### Scenario 3: Guest Booking
1. Don't login
2. Go to booking page
3. Fill all fields manually
4. Submit booking
5. See confirmation
6. Check Supabase - booking should have `user_id: null`

## 🛡️ Security Notes

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only see their own data
- ✅ Proper authentication checks
- ✅ SQL injection prevention
- ✅ XSS protection via Supabase

## 📞 Need Help?

If you encounter issues:
1. Check the browser console (F12)
2. Review `BOOKING_SYSTEM_UPDATES.md` for detailed info
3. Check Supabase logs and errors
4. Verify all files are properly loaded
5. Test in incognito/private mode

## ✨ What's New

### Version 2.0 Updates
- ✅ Fixed calendar refresh issue
- ✅ Added form data persistence
- ✅ Integrated real-time dashboard data
- ✅ Improved date validation
- ✅ Added loading states
- ✅ Enhanced error handling
- ✅ Better mobile support
- ✅ Prevented double submissions
- ✅ Auto-save functionality

---

**Ready to test?** Start at `login.html` to create an account!

**Last Updated**: November 10, 2025
