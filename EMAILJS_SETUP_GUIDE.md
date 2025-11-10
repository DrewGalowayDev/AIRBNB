# 📧 EmailJS Setup Guide - Send Real Booking Confirmation Emails

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create EmailJS Account

1. Go to **https://www.emailjs.com**
2. Click **"Sign Up Free"**
3. Create account (free plan: 200 emails/month)
4. Verify your email address

### Step 2: Add Email Service

1. In EmailJS Dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (easiest - use your Gmail)
   - **Outlook**
   - **Yahoo**
   - **Or any SMTP service**
4. Click **"Connect Account"**
5. Follow the prompts to authorize
6. **Copy the Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template

1. In EmailJS Dashboard, click **"Email Templates"**
2. Click **"Create New Template"**
3. **Template Name**: `Booking Confirmation`
4. **Template ID**: `template_booking` (must match code)

5. **IMPORTANT - Use these EXACT variable names** (camelCase):
   - `bookingNumber` ✅
   - `guestName` ✅
   - `apartmentName` ✅
   - `checkIn` ✅
   - `checkOut` ✅
   - `nights` ✅
   - `adults` ✅
   - `children` ✅
   - `totalAmount` ✅
   - `specialRequest` ✅
   - `guestEmail` ✅

6. **Paste this in the Content section** (plain text version):

```
Subject: Booking Confirmation - {{bookingNumber}}

Hello {{guestName}},

Thank you for choosing LOFT CITY! Your booking has been confirmed.

BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking Number: {{bookingNumber}}
Apartment: {{apartmentName}}

Check-in Date: {{checkIn}}
Check-out Date: {{checkOut}}
Total Nights: {{nights}}
Guests: {{adults}} Adult(s), {{children}} Child(ren)

Total Amount: {{totalAmount}}

Special Request: {{specialRequest}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECK-IN INFORMATION
• Time: 2:00 PM
• Location: Kisumu, Kenya
• Please bring valid ID

CONTACT US
📞 Phone: +254 722 349 029
📧 Email: info@loftcity.com

We look forward to hosting you!

Best regards,
LOFT CITY Team
Kisumu, Kenya
```

7. **Set "To email"**: `{{to_email}}`
8. **Set "Reply to"**: `info@loftcity.com`
9. Click **"Save"**

### Step 4: Get Your Public Key

1. Go to **"Account"** in EmailJS Dashboard
2. Find **"Public Key"** section
3. **Copy your public key** (looks like: `aBcD123_EfGh456`)

### Step 5: Update Your Website

1. Open `booking.html` file
2. Find this line (around line 266):
   ```javascript
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```
3. Replace `YOUR_PUBLIC_KEY` with your actual key:
   ```javascript
   const EMAILJS_PUBLIC_KEY = 'aBcD123_EfGh456'; // Your actual key
   ```
4. Save the file

### Step 6: Update Service ID (if different)

1. Open `js/booking-handler.js`
2. Find this line:
   ```javascript
   'service_loftcity', // Service ID
   ```
3. Replace with your Service ID:
   ```javascript
   'service_xxxxxxx', // Your Service ID from Step 2
   ```

### Step 7: Test!

1. Open your website
2. Make a test booking
3. Check the browser console for:
   ```
   ✅ EmailJS initialized
   📧 Preparing to send confirmation email
   ✅ Email sent successfully!
   ```
4. **Check your email inbox!** 📬

---

## 🎨 Optional: Create Beautiful HTML Email Template

For a more professional look:

### In EmailJS Template Editor:

1. Switch to **HTML mode**
2. Paste this HTML:

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    
    <!-- Header Section -->
    <div style="border-top: 6px solid #00CED1; padding: 16px;">
      <a style="text-decoration: none; outline: none; margin-right: 8px; vertical-align: middle;" href="https://your-website.com" target="_blank">
        <img style="height: 32px; vertical-align: middle;" height="32px" src="https://your-logo-url.com/logo.png" alt="LOFT CITY" />
      </a>
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px;">
        <strong>Booking Confirmation</strong>
      </span>
    </div>
    
    <!-- Content Section -->
    <div style="padding: 0 16px;">
      <p>Hello <strong>{{guestName}}</strong>,</p>
      <p>Thank you for choosing LOFT CITY! Your booking has been confirmed. We look forward to hosting you in Kisumu.</p>
      
      <!-- Booking Number -->
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #00CED1; margin-bottom: 16px;">
        <strong>Booking # {{bookingNumber}}</strong>
      </div>
      
      <!-- Booking Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Apartment</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            {{apartmentName}}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Check-in Date</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            {{checkIn}}
          </td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Check-out Date</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            {{checkOut}}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Total Nights</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            {{nights}}
          </td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Guests</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            {{adults}} Adult(s), {{children}} Child(ren)
          </td>
        </tr>
      </table>
      
      <!-- Pricing Summary -->
      <div style="padding: 24px 0;">
        <div style="border-top: 2px solid #333;"></div>
      </div>
      
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
      
      <!-- Important Information -->
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
      
      <!-- Contact Information -->
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
  
  <!-- Footer -->
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

---

## 🔧 Troubleshooting

### Problem: "EmailJS not configured" in console
**Solution**: Add your public key in `booking.html`

### Problem: "Service ID not found"
**Solution**: Update service ID in `booking-handler.js`

### Problem: "Template ID not found"
**Solution**: Make sure template ID is exactly `template_booking`

### Problem: Email not received
**Check**:
1. Spam/Junk folder
2. Email service is connected in EmailJS
3. Template is saved and active
4. Check EmailJS Dashboard > Logs for errors

### Problem: "Failed to send email"
**Solution**: 
1. Check browser console for specific error
2. Verify EmailJS service is active
3. Check you haven't exceeded free plan limit (200/month)

---

## 📊 EmailJS Free Plan Limits

- ✅ **200 emails per month**
- ✅ Unlimited email services
- ✅ Unlimited templates
- ✅ Email logs for 30 days

**Need more?** Upgrade to paid plan or use SendGrid/Mailgun.

---

## 🎯 Quick Checklist

- [ ] Create EmailJS account
- [ ] Add email service (Gmail/Outlook)
- [ ] Create template with ID: `template_booking`
- [ ] Copy public key
- [ ] Update `booking.html` with public key
- [ ] Update `booking-handler.js` with service ID
- [ ] Test booking
- [ ] Check email received
- [ ] ✅ Done!

---

## 📝 Template Variables Used

Make sure these are in your EmailJS template:

- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{booking_number}}` - Booking reference
- `{{guest_name}}` - Guest full name
- `{{apartment_name}}` - Property name
- `{{check_in}}` - Check-in date
- `{{check_out}}` - Check-out date
- `{{nights}}` - Number of nights
- `{{adults}}` - Number of adults
- `{{children}}` - Number of children
- `{{total_amount}}` - Total price
- `{{special_request}}` - Special requests
- `{{contact_phone}}` - Your phone number
- `{{contact_email}}` - Your email

---

## 🚀 After Setup

Once configured, every booking will automatically:
1. ✅ Create booking in database
2. ✅ Show confirmation modal
3. ✅ **Send email to customer**
4. ✅ Log email status in console

---

**Need help?** 
- EmailJS Docs: https://www.emailjs.com/docs
- Support: https://www.emailjs.com/docs/support

**Estimated Time**: 5-10 minutes
**Cost**: FREE (200 emails/month)

---

**Last Updated**: November 10, 2025
