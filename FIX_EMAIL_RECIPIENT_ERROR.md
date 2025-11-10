# 🚨 URGENT FIX: "Recipients Address is Empty" Error

## ❌ Current Error:
```
status: 422
text: "The recipients address is empty"
```

## ✅ The Fix (Takes 30 seconds):

### Step-by-Step:

1. **Go to EmailJS Dashboard**
   - URL: https://dashboard.emailjs.com/admin/templates

2. **Click on your template**: `template_booking`

3. **Look at the TOP of the page** - You'll see a section called **"Settings"**

4. **Find this field**: 
   ```
   To email: [____________]
   ```

5. **In that box, type EXACTLY**:
   ```
   {{to_email}}
   ```
   (Include the double curly braces!)

6. **Click the "Save" button** at the bottom

7. **Done!** Go back to your website and try booking again.

---

## 📸 What It Looks Like:

```
┌─────────────────────────────────────────────┐
│ Template Settings                           │
├─────────────────────────────────────────────┤
│                                             │
│ Template Name: template_booking             │
│                                             │
│ To email: {{to_email}}          ← TYPE THIS!│
│                                             │
│ Subject: Booking Confirmation #{{bookingNu…│
│                                             │
│ From name: LOFT CITY                        │
│                                             │
│ Reply to: info@loftcity.com                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔍 Why This Happens:

EmailJS needs **TWO places** to know where to send the email:

1. ✅ **In your code** (already done):
   ```javascript
   to_email: booking.email  // ✅ This is set correctly
   ```

2. ❌ **In EmailJS template settings** (needs to be set):
   ```
   To email: {{to_email}}   // ❌ You need to add this!
   ```

The `{{to_email}}` in the template settings tells EmailJS: 
*"Use the value from the `to_email` variable that the code sends"*

---

## ✅ After You Fix It:

Your browser console will show:
```
✅ EmailJS initialized successfully
Preparing to send confirmation email to: your@email.com
Email data: {to_email: "your@email.com", bookingNumber: "BK-12345", ...}
✅ Email sent successfully!
```

And you'll receive the email! 📧🎉

---

## 🆘 Still Not Working?

**Double-check these**:

1. ✅ "To email" field has: `{{to_email}}` (with curly braces)
2. ✅ You clicked "Save" after adding it
3. ✅ The template name is exactly: `template_booking`
4. ✅ Your email service is connected in EmailJS dashboard

**Refresh your website** and try again!

---

## 📞 Current Setup (All Correct!):
- ✅ Public Key: `0NpDq7kjgwcQNHCwW`
- ✅ Service ID: `service_5c1rhj`
- ✅ Template ID: `template_booking`
- ✅ Code sending: `to_email` ✓
- ❌ Template setting: **Missing `{{to_email}}` ← FIX THIS!**
