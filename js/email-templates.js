// =====================================================
// EMAIL TEMPLATES FOR BOOKING SYSTEM
// =====================================================

// Generate HTML email for booking confirmation
function generateBookingConfirmationEmail(emailData) {
    const {
        bookingNumber,
        guestName,
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
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px;
        }
        .booking-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .booking-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .booking-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #666;
        }
        .value {
            color: #333;
        }
        .total {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
            text-align: center;
            border: 2px solid #00CED1;
        }
        .total-amount {
            font-size: 32px;
            color: #00CED1;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            margin: 20px 0;
            padding: 15px;
            background: #e8f8f8;
            border-left: 4px solid #00CED1;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon">✓</div>
            <h1>Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your stay is confirmed at LOFT CITY</p>
        </div>
        
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Hello ${guestName},</h2>
            <p style="color: #666; line-height: 1.6;">
                Thank you for choosing LOFT CITY! We're excited to host you at our beautiful apartment in Kisumu.
                Your booking has been successfully confirmed.
            </p>
            
            <div class="booking-info">
                <h3 style="margin-top: 0; color: #222; border-bottom: 2px solid #00CED1; padding-bottom: 10px;">
                    Booking Details
                </h3>
                <div class="booking-row">
                    <span class="label">Booking Number:</span>
                    <span class="value" style="color: #00CED1; font-weight: bold;">${bookingNumber}</span>
                </div>
                <div class="booking-row">
                    <span class="label">Apartment:</span>
                    <span class="value">${apartmentName}</span>
                </div>
                <div class="booking-row">
                    <span class="label">Check-in Date:</span>
                    <span class="value">${checkIn}</span>
                </div>
                <div class="booking-row">
                    <span class="label">Check-out Date:</span>
                    <span class="value">${checkOut}</span>
                </div>
                <div class="booking-row">
                    <span class="label">Total Nights:</span>
                    <span class="value">${nights}</span>
                </div>
                <div class="booking-row">
                    <span class="label">Guests:</span>
                    <span class="value">${adults} Adult(s)${children > 0 ? `, ${children} Child(ren)` : ''}</span>
                </div>
                ${specialRequest && specialRequest !== 'None' ? `
                <div class="booking-row">
                    <span class="label">Special Request:</span>
                    <span class="value">${specialRequest}</span>
                </div>
                ` : ''}
                
                <div class="total">
                    <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Total Amount</div>
                    <div class="total-amount">${totalAmount}</div>
                </div>
            </div>
            
            <div class="contact-info">
                <strong style="color: #00CED1;">📍 Location:</strong> Kisumu, Kenya<br>
                <strong style="color: #00CED1;">📞 Phone:</strong> +254 722 349 029<br>
                <strong style="color: #00CED1;">📧 Email:</strong> info@loftcity.com
            </div>
            
            <div style="text-align: center;">
                <p style="color: #666;">
                    <strong>Check-in Time:</strong> 2:00 PM<br>
                    <strong>Check-out Time:</strong> 11:00 AM
                </p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <strong style="color: #856404;">📋 Important Information:</strong>
                <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                    <li>Please bring a valid ID for check-in</li>
                    <li>A refundable security deposit may be required</li>
                    <li>Parking is available on-site</li>
                    <li>WiFi password will be provided upon check-in</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 10px 0;">
                If you have any questions or need to modify your booking, please contact us.
            </p>
            <p style="margin: 10px 0;">
                <strong>LOFT CITY</strong><br>
                Kisumu, Kenya<br>
                Phone: +254 722 349 029
            </p>
            <p style="margin: 20px 0 10px 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} LOFT CITY. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateBookingConfirmationEmail };
}
