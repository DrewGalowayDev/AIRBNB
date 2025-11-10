# 🔧 Fix EmailJS 422 Error - Template Variables

## ❌ Problem
You're getting error 422 because your EmailJS template uses **underscore_case** variables but the code sends **camelCase** variables.

## ✅ Solution: Update Your EmailJS Template

### Step 1: Go to EmailJS Dashboard
1. Visit https://dashboard.emailjs.com/admin
2. Click on **"Email Templates"**
3. Select your **"template_booking"** template
4. Click **"Edit"**

### Step 2: Replace ALL Variables

**IMPORTANT**: EmailJS is case-sensitive! Use these EXACT variable names:

#### ✅ CORRECT Variables (camelCase):
```
{{bookingNumber}}     ← NOT booking_number
{{guestName}}         ← NOT guest_name
{{guestEmail}}        ← NOT guest_email
{{apartmentName}}     ← NOT apartment_name
{{checkIn}}           ← NOT check_in
{{checkOut}}          ← NOT check_out
{{nights}}            ← OK
{{adults}}            ← OK
{{children}}          ← OK
{{totalAmount}}       ← NOT total_amount
{{specialRequest}}    ← NOT special_request
```

### Step 3: Update Your Template Content
 

**Option 1: Simple Text Template**

```
Subject: Booking Confirmation #{{bookingNumber}}

Hello {{guestName}},

Thank you for choosing LOFT CITY! Your booking has been confirmed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Booking Number: {{bookingNumber}}
🏢 Apartment: {{apartmentName}}

📅 Check-in: {{checkIn}}
📅 Check-out: {{checkOut}}
🌙 Total Nights: {{nights}}
👥 Guests: {{adults}} Adult(s), {{children}} Child(ren)

💰 Total Amount: {{totalAmount}}

📝 Special Request: {{specialRequest}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK-IN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Check-in Time: 2:00 PM
⏰ Check-out Time: 11:00 AM
📍 Location: Kisumu, Kenya
🆔 Please bring valid ID

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT US
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 Phone: +254 722 349 029
📧 Email: info@loftcity.com

We look forward to hosting you!

Best regards,
LOFT CITY Team
Kisumu, Kenya

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This email was sent to {{to_email}}
Booking Reference: {{bookingNumber}}
© 2025 LOFT CITY. All rights reserved.
```

**Option 2: Beautiful HTML Template**

Switch to **HTML mode** and paste:

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    
    <div style="border-top: 6px solid #00CED1; padding: 16px;">
      <span style="font-size: 20px; font-weight: bold; color: #00CED1;">🏢 LOFT CITY</span>
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px; margin-left: 8px;">
        <strong>Booking Confirmation</strong>
      </span>
    </div>
    
    <div style="padding: 0 16px;">
      <p>Hello <strong>{{guestName}}</strong>,</p>
      <p>Thank you for choosing LOFT CITY! Your booking has been confirmed.</p>
      
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #00CED1; margin-bottom: 16px;">
        <strong>Booking # {{bookingNumber}}</strong>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;"><strong>Apartment</strong></td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">{{apartmentName}}</td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;"><strong>Check-in Date</strong></td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">{{checkIn}}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;"><strong>Check-out Date</strong></td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">{{checkOut}}</td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;"><strong>Total Nights</strong></td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">{{nights}}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;"><strong>Guests</strong></td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">{{adults}} Adult(s), {{children}} Child(ren)</td>
        </tr>
      </table>
      
      <div style="padding: 24px 0;"><div style="border-top: 2px solid #333;"></div></div>
      
      <table style="border-collapse: collapse; width: 100%; text-align: right; margin-bottom: 24px;">
        <tr>
          <td style="width: 60%;"></td>
          <td style="padding: 8px;">Price per Night</td>
          <td style="padding: 8px; white-space: nowrap;"><strong>KES 5,000</strong></td>
        </tr>
        <tr>
          <td style="width: 60%;"></td>
          <td style="padding: 8px; border-top: 2px solid #333;">
            <strong style="white-space: nowrap; font-size: 16px;">Total Amount</strong>
          </td>
          <td style="padding: 16px 8px; border-top: 2px solid #333; white-space: nowrap;">
            <strong style="font-size: 18px; color: #00CED1;">{{totalAmount}}</strong>
          </td>
        </tr>
      </table>
      
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <strong style="color: #856404;">📋 Important Information</strong>
        <ul style="margin: 10px 0; padding-left: 20px; color: #856404; line-height: 1.8;">
          <li>Check-in time: 2:00 PM</li>
          <li>Check-out time: 11:00 AM</li>
          <li>Please bring a valid ID</li>
          <li>Secure parking available</li>
          <li>WiFi included</li>
        </ul>
      </div>
      
      <div style="background-color: #e8f8f8; border-left: 4px solid #00CED1; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <strong style="color: #00CED1;">📞 Contact Us</strong>
        <p style="margin: 10px 0 0 0; line-height: 1.8;">
          <strong>Location:</strong> Kisumu, Kenya<br>
          <strong>Phone:</strong> +254 722 349 029<br>
          <strong>Email:</strong> info@loftcity.com
        </p>
      </div>
      
      <p style="text-align: center; color: #666; margin: 24px 0;">
        We look forward to hosting you at LOFT CITY!
      </p>
    </div>
  </div>
  
  <div style="max-width: 600px; margin: auto; padding: 16px 0;">
    <p style="color: #999; text-align: center; font-size: 12px; line-height: 1.6;">
      This email was sent to {{to_email}}<br>
      You received this email because you made a booking with LOFT CITY<br>
      Booking Number: {{bookingNumber}}
    </p>
    <p style="color: #999; text-align: center; font-size: 12px;">
      © 2025 LOFT CITY. All rights reserved.
    </p>
  </div>
</div>
```

### Step 4: Configure Email Settings (CRITICAL!)

**THIS IS THE MOST IMPORTANT STEP - Don't skip it!**

1. **Scroll to "Settings" section in the template editor**
2. **Find "To email" field** (usually at the top)
3. **Type exactly**: `{{to_email}}` (with double curly braces)
4. **Subject**: `Booking Confirmation #{{bookingNumber}} - LOFT CITY`
5. **From name** (optional): `LOFT CITY`
6. **Reply to**: `info@loftcity.com`
7. Click **"Save"** (Make sure to save!)

⚠️ **Common Mistake**: Forgetting to set the "To email" field to `{{to_email}}`
This will cause "recipients address is empty" error!

### Step 5: Test Your Template

1. Click **"Test"** button in EmailJS dashboard
2. Fill in these test values:
   ```
   to_email: your-email@example.com
   bookingNumber: TEST123
   guestName: John Doe
   apartmentName: Luxury Studio
   checkIn: 2025-11-15
   checkOut: 2025-11-17
   nights: 2
   adults: 2
   children: 0
   totalAmount: KES 10,000
   specialRequest: Late check-in
   ```
3. Click **"Send Test"**
4. Check your email!

### Step 6: Test on Your Website

1. Refresh your booking page
2. Create a test booking
3. Check browser console - you should see:
   ```
   ✅ EmailJS initialized successfully
   Preparing to send confirmation email to: your@email.com
   ✅ Email sent successfully!
   ```
4. Check your email inbox! 📬

---

## 📋 Quick Checklist

- [ ] Updated all variables to camelCase in EmailJS template
- [ ] Saved the template in EmailJS dashboard
- [ ] Set "To email" to `{{to_email}}`
- [ ] Set "Reply to" to `info@loftcity.com`
- [ ] Tested template in EmailJS dashboard
- [ ] Tested booking on website
- [ ] Received confirmation email

---

## 🆘 Still Having Issues?

### Check Console Errors:
```javascript
// Open browser console (F12) and look for:
✅ EmailJS initialized successfully  // Good!
❌ EmailJS error: ...                 // Problem!
```

### Common Issues:

**Error 422: "The recipients address is empty"** ⚠️ YOU HAVE THIS ERROR!
- **Solution**: In EmailJS template settings, set "To email" field to `{{to_email}}`
- **How to fix**:
  1. Go to https://dashboard.emailjs.com/admin/templates
  2. Edit `template_booking`
  3. Look for "Settings" section at the top
  4. Find "To email" field
  5. Type: `{{to_email}}` (exactly like this)
  6. Click "Save"
  7. Try booking again!

**Error 422**: Template variables don't match
- Solution: Double-check variable names (case-sensitive!)

**Error 403**: Wrong public key or service ID
- Solution: Verify credentials in booking.html

**Error 413**: Template too large
- Solution: Use simpler template (text version)

**No error but no email**: Email service not connected
- Solution: Connect Gmail/Outlook in EmailJS dashboard

---

## 📞 Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com/admin
- Check EmailJS Logs: Dashboard > History

Your current setup:
- Public Key: `0NpDq7kjgwcQNHCwW` ✅
- Service ID: `service_5c1rhj` ✅
- Template ID: `template_booking` ✅
