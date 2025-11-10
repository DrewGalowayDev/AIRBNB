// =====================================================
// EMAIL TEMPLATES FOR BOOKING SYSTEM
// =====================================================

// Generate HTML email for booking confirmation
function generateBookingConfirmationEmail(emailData) {
    const {
        bookingNumber,
        guestName,
        guestEmail,
        apartmentName,
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        totalAmount,
        specialRequest
    } = emailData;
    
    return `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    
    <!-- Header Section -->
    <div style="border-top: 6px solid #00CED1; padding: 16px;">
      <span style="font-size: 20px; font-weight: bold; color: #00CED1;">
        🏢 LOFT CITY
      </span>
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px; margin-left: 8px;">
        <strong>Booking Confirmation</strong>
      </span>
    </div>
    
    <!-- Content Section -->
    <div style="padding: 0 16px;">
      <p>Hello <strong>${guestName}</strong>,</p>
      <p>Thank you for choosing LOFT CITY! Your booking has been confirmed. We look forward to hosting you in Kisumu.</p>
      
      <!-- Booking Number -->
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #00CED1; margin-bottom: 16px;">
        <strong>Booking # ${bookingNumber}</strong>
      </div>
      
      <!-- Booking Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Apartment</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            ${apartmentName}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Check-in Date</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            ${checkIn}
          </td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Check-out Date</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            ${checkOut}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Total Nights</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            ${nights}
          </td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Guests</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            ${adults} Adult(s)${children > 0 ? `, ${children} Child(ren)` : ''}
          </td>
        </tr>
        ${specialRequest && specialRequest !== 'None' ? `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0;">
            <strong>Special Request</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right;">
            ${specialRequest}
          </td>
        </tr>
        ` : ''}
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
            <strong style="font-size: 18px; color: #00CED1;">${totalAmount}</strong>
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
      This email was sent to ${guestEmail || 'your email'}<br>
      You received this email because you made a booking with LOFT CITY<br>
      Booking Number: ${bookingNumber}
    </p>
    <p style="color: #999; text-align: center; font-size: 12px;">
      © 2025 LOFT CITY. All rights reserved.
    </p>
  </div>
</div>
    `;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateBookingConfirmationEmail };
}
