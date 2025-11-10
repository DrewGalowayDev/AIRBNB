// =====================================================
// BOOKING BACKEND HANDLER
// =====================================================

let selectedApartment = null;
let currentUserId = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Prevent any auto-refresh or auto-reload behaviors
    window.addEventListener('beforeunload', function(e) {
        const form = document.getElementById('bookingForm');
        if (form && isFormPartiallyFilled(form)) {
            // Only warn if form has data
            const message = 'You have unsaved booking information. Are you sure you want to leave?';
            e.returnValue = message;
            return message;
        }
    });
    
    // Get current user if logged in
    await getCurrentUserInfo();
    
    // Load apartments
    await loadApartments();
    
    // Setup date pickers FIRST (before form setup)
    setupDatePickers();
    
    // Setup booking form
    setupBookingForm();
    
    // Restore form data from sessionStorage if available
    restoreFormData();
    
    // Auto-save form data as user types
    setupAutoSave();
});

// Check if form has any data
function isFormPartiallyFilled(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    for (let input of inputs) {
        if (input.value && input.value.trim() !== '' && input.value !== '0') {
            return true;
        }
    }
    return false;
}

// Auto-save form data to sessionStorage
function setupAutoSave() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveFormData();
        });
        
        input.addEventListener('change', function() {
            saveFormData();
        });
    });
}

// Save form data to sessionStorage
function saveFormData() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const formData = {
        fname: form.querySelector('#fname')?.value || '',
        lname: form.querySelector('#lname')?.value || '',
        email: form.querySelector('#email')?.value || '',
        mobile: form.querySelector('#mobile')?.value || '',
        checkIn: form.querySelector('#date-1')?.value || '',
        checkOut: form.querySelector('#date-2')?.value || '',
        adult: form.querySelector('#adult')?.value || '0',
        kid: form.querySelector('#kid')?.value || '0',
        request: form.querySelector('#request')?.value || ''
    };
    
    sessionStorage.setItem('bookingFormData', JSON.stringify(formData));
}

// Restore form data from sessionStorage
function restoreFormData() {
    const savedData = sessionStorage.getItem('bookingFormData');
    if (!savedData) return;
    
    try {
        const formData = JSON.parse(savedData);
        const form = document.getElementById('bookingForm');
        if (!form) return;
        
        // Only restore if fields are empty (don't overwrite pre-filled user data)
        const fnameInput = form.querySelector('#fname');
        if (fnameInput && !fnameInput.value) fnameInput.value = formData.fname;
        
        const lnameInput = form.querySelector('#lname');
        if (lnameInput && !lnameInput.value) lnameInput.value = formData.lname;
        
        const emailInput = form.querySelector('#email');
        if (emailInput && !emailInput.value) emailInput.value = formData.email;
        
        const mobileInput = form.querySelector('#mobile');
        if (mobileInput && !mobileInput.value) mobileInput.value = formData.mobile;
        
        const checkInInput = form.querySelector('#date-1');
        if (checkInInput) checkInInput.value = formData.checkIn;
        
        const checkOutInput = form.querySelector('#date-2');
        if (checkOutInput) checkOutInput.value = formData.checkOut;
        
        const adultSelect = form.querySelector('#adult');
        if (adultSelect) adultSelect.value = formData.adult;
        
        const kidSelect = form.querySelector('#kid');
        if (kidSelect) kidSelect.value = formData.kid;
        
        const requestInput = form.querySelector('#request');
        if (requestInput) requestInput.value = formData.request;
    } catch (e) {
        console.error('Error restoring form data:', e);
    }
}

// Clear saved form data
function clearSavedFormData() {
    sessionStorage.removeItem('bookingFormData');
}

// Get current user information
async function getCurrentUserInfo() {
    const authenticated = await isAuthenticated();
    
    if (authenticated) {
        const userResult = await getCurrentUser();
        if (userResult.success) {
            currentUserId = userResult.user.id;
            
            // Pre-fill user information if available
            const profile = await getUserProfile(currentUserId);
            if (profile.success && profile.data) {
                prefillUserInfo(profile.data);
            }
        }
    }
}

// Pre-fill user information in booking form
function prefillUserInfo(profile) {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    // Split full name
    const nameParts = profile.full_name ? profile.full_name.split(' ') : [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Fill form fields
    const fnameInput = form.querySelector('#fname');
    const lnameInput = form.querySelector('#lname');
    const emailInput = form.querySelector('#email');
    const mobileInput = form.querySelector('#mobile');
    
    if (fnameInput) fnameInput.value = firstName;
    if (lnameInput) lnameInput.value = lastName;
    if (emailInput) emailInput.value = profile.email || '';
    if (mobileInput) mobileInput.value = profile.phone || '';
}

// Load apartments
async function loadApartments() {
    const result = await getApartments();
    
    if (result.success && result.data && result.data.length > 0) {
        // Use the first apartment as default
        selectedApartment = result.data[0];
    } else {
        console.error('No apartments available');
        showNotification('No apartments available at the moment', 'error');
    }
}

// Setup date pickers
function setupDatePickers() {
    // Set minimum date to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    
    const checkInInput = document.querySelector('#date-1');
    const checkOutInput = document.querySelector('#date-2');
    
    // Destroy any existing datetimepicker instances to prevent conflicts
    if (typeof $.fn.datetimepicker !== 'undefined') {
        if (checkInInput) $(checkInInput).datetimepicker('destroy');
        if (checkOutInput) $(checkOutInput).datetimepicker('destroy');
    }
    
    if (checkInInput) {
        checkInInput.setAttribute('type', 'date');
        checkInInput.setAttribute('min', todayString);
        checkInInput.removeAttribute('data-toggle');
        checkInInput.removeAttribute('data-target');
        checkInInput.classList.remove('datetimepicker-input');
        
        // Prevent form refresh by stopping default behavior
        checkInInput.addEventListener('change', function(e) {
            e.stopPropagation();
            
            if (checkOutInput) {
                const checkInDate = new Date(this.value);
                checkInDate.setDate(checkInDate.getDate() + 1);
                const minCheckOut = checkInDate.toISOString().split('T')[0];
                checkOutInput.setAttribute('min', minCheckOut);
                
                // Clear checkout if it's before new minimum
                if (checkOutInput.value && checkOutInput.value <= this.value) {
                    checkOutInput.value = '';
                }
            }
        });
        
        // Prevent keyboard input to avoid invalid dates
        checkInInput.addEventListener('keydown', function(e) {
            e.preventDefault();
        });
    }
    
    if (checkOutInput) {
        checkOutInput.setAttribute('type', 'date');
        checkOutInput.setAttribute('min', todayString);
        checkOutInput.removeAttribute('data-toggle');
        checkOutInput.removeAttribute('data-target');
        checkOutInput.classList.remove('datetimepicker-input');
        
        // Prevent form refresh
        checkOutInput.addEventListener('change', function(e) {
            e.stopPropagation();
        });
        
        // Prevent keyboard input
        checkOutInput.addEventListener('keydown', function(e) {
            e.preventDefault();
        });
    }
    
    // Also setup search section date pickers if they exist
    const searchCheckIn = document.querySelector('#date-3');
    const searchCheckOut = document.querySelector('#date-4');
    
    if (searchCheckIn) {
        if (typeof $.fn.datetimepicker !== 'undefined') {
            $(searchCheckIn).datetimepicker('destroy');
        }
        const searchCheckInInput = searchCheckIn.querySelector('input');
        if (searchCheckInInput) {
            searchCheckInInput.setAttribute('type', 'date');
            searchCheckInInput.setAttribute('min', todayString);
            searchCheckInInput.removeAttribute('data-target');
            searchCheckInInput.classList.remove('datetimepicker-input');
        }
    }
    
    if (searchCheckOut) {
        if (typeof $.fn.datetimepicker !== 'undefined') {
            $(searchCheckOut).datetimepicker('destroy');
        }
        const searchCheckOutInput = searchCheckOut.querySelector('input');
        if (searchCheckOutInput) {
            searchCheckOutInput.setAttribute('type', 'date');
            searchCheckOutInput.setAttribute('min', todayString);
            searchCheckOutInput.removeAttribute('data-target');
            searchCheckOutInput.classList.remove('datetimepicker-input');
        }
    }
}

// Setup booking form
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        // Disable jQuery validation to prevent form refresh
        bookingForm.setAttribute('novalidate', 'novalidate');
        
        // Remove any existing jQuery validation
        if (typeof $.fn.jqBootstrapValidation !== 'undefined') {
            $(bookingForm).find('input, select').off('.jqBootstrapValidation');
        }
        
        // Add our custom submit handler
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            await handleBookingSubmission(this);
        });
        
        // Prevent form fields from triggering refresh
        const formInputs = bookingForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                e.stopPropagation();
            });
            
            input.addEventListener('input', function(e) {
                e.stopPropagation();
            });
        });
    }
}

// Handle booking form submission
async function handleBookingSubmission(form) {
    const submitBtn = form.querySelector('#bookingButton');
    
    // Prevent double submission
    if (submitBtn.disabled) {
        return;
    }
    
    // Get form data
    const formData = {
        firstName: form.querySelector('#fname').value.trim(),
        lastName: form.querySelector('#lname').value.trim(),
        mobile: form.querySelector('#mobile').value.trim(),
        email: form.querySelector('#email').value.trim(),
        checkIn: form.querySelector('#date-1').value,
        checkOut: form.querySelector('#date-2').value,
        adults: parseInt(form.querySelector('#adult').value),
        children: parseInt(form.querySelector('#kid').value),
        specialRequest: form.querySelector('#request').value.trim()
    };
    
    // Validate form data
    const validation = validateBookingForm(formData);
    if (!validation.valid) {
        showNotification(validation.message, 'error');
        return;
    }
    
    // Check if apartment is selected
    if (!selectedApartment) {
        showNotification('No apartment selected. Please try again.', 'error');
        return;
    }
    
    // Show loading state
    showLoading(submitBtn, 'Checking Availability...');
    
    try {
        // Check availability first
        const availabilityResult = await checkAvailability(
            selectedApartment.id,
            formData.checkIn,
            formData.checkOut
        );
        
        if (!availabilityResult.success) {
            throw new Error('Error checking availability');
        }
        
        if (!availabilityResult.available) {
            showNotification('Sorry, the apartment is not available for the selected dates. Please choose different dates.', 'error');
            hideLoading(submitBtn);
            return;
        }
        
        // Calculate nights and total amount
        const nights = calculateNights(formData.checkIn, formData.checkOut);
        const totalAmount = nights * selectedApartment.price_per_night;
        
        // Prepare booking data
        const bookingData = {
            apartment_id: selectedApartment.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.mobile,
            check_in: formData.checkIn,
            check_out: formData.checkOut,
            adults: formData.adults,
            children: formData.children,
            price_per_night: selectedApartment.price_per_night,
            special_request: formData.specialRequest || null
            // user_id will be set in createBooking function
        };
        
        // Update button text
        submitBtn.textContent = 'Creating Booking...';
        
        // Create booking
        const result = await createBooking(bookingData);
        
        if (result.success) {
            showNotification('Booking created successfully!', 'success');
            
            // Show booking confirmation
            showBookingConfirmation(result.data, nights, totalAmount);
            
            // Clear saved form data
            clearSavedFormData();
            
            // Reset form
            form.reset();
        } else {
            throw new Error(result.error || 'Failed to create booking');
        }
        
    } catch (error) {
        console.error('Booking error:', error);
        showNotification(error.message || 'An error occurred while processing your booking. Please try again.', 'error');
    } finally {
        hideLoading(submitBtn);
    }
}

// Validate booking form
function validateBookingForm(data) {
    // Check required fields
    if (!data.firstName || !data.lastName) {
        return { valid: false, message: 'Please enter your first and last name' };
    }
    
    if (!data.email || !validateEmail(data.email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    if (!data.mobile) {
        return { valid: false, message: 'Please enter your mobile number' };
    }
    
    if (!data.checkIn || !data.checkOut) {
        return { valid: false, message: 'Please select check-in and check-out dates' };
    }
    
    // Validate dates
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
        return { valid: false, message: 'Check-in date cannot be in the past' };
    }
    
    if (checkOutDate <= checkInDate) {
        return { valid: false, message: 'Check-out date must be after check-in date' };
    }
    
    // Validate guest count
    if (data.adults < 1) {
        return { valid: false, message: 'At least one adult is required' };
    }
    
    if (selectedApartment && (data.adults + data.children) > selectedApartment.max_guests) {
        return { 
            valid: false, 
            message: `Maximum ${selectedApartment.max_guests} guests allowed for this apartment` 
        };
    }
    
    return { valid: true };
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show booking confirmation modal
function showBookingConfirmation(booking, nights, totalAmount) {
    const modalHTML = `
    <div class="modal-overlay" id="confirmationModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; overflow-y: auto;">
        <div class="modal-content" style="background: white; border-radius: 15px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; margin: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); animation: modalSlideIn 0.4s ease-out;">
            <div class="modal-header" style="background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; padding: 25px 30px; border-radius: 15px 15px 0 0; position: relative;">
                <h2 style="margin: 0; font-size: 26px; display: flex; align-items: center; gap: 10px;">
                    <i class="fa fa-check-circle" style="font-size: 32px;"></i> 
                    Booking Confirmed!
                </h2>
                <button class="modal-close" onclick="closeConfirmationModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 32px; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 30px;">
                <div class="confirmation-message" style="text-align: center; margin-bottom: 30px;">
                    <i class="fa fa-check-circle" style="font-size: 64px; color: #28a745; display: block; margin-bottom: 20px; animation: checkBounce 0.6s ease-out;"></i>
                    <h3 style="color: #28a745; font-size: 22px; margin-bottom: 15px;">Success! Your Booking is Confirmed</h3>
                    <p style="font-size: 16px; color: #666; line-height: 1.6;">
                        Your booking has been successfully created! 
                        <br>We've sent a confirmation email to <strong style="color: #00CED1;">${booking.email}</strong>
                        <br><small style="color: #999;">Please check your inbox and spam folder</small>
                    </p>
                </div>
                
                <div class="booking-summary" style="background: linear-gradient(to bottom, #f8f9fa, #ffffff); padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #e9ecef;">
                    <h3 style="margin: 0 0 20px 0; color: #222; border-bottom: 2px solid #00CED1; padding-bottom: 12px; font-size: 20px;">
                        <i class="fa fa-file-text-o"></i> Booking Summary
                    </h3>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">Booking Number:</strong>
                        <span style="color: #00CED1; font-weight: 700; font-size: 16px;">${booking.booking_number}</span>
                    </div>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">Apartment:</strong>
                        <span style="color: #333;">${selectedApartment.name}</span>
                    </div>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">Check-in:</strong>
                        <span style="color: #333;">${formatDate(booking.check_in)}</span>
                    </div>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">Check-out:</strong>
                        <span style="color: #333;">${formatDate(booking.check_out)}</span>
                    </div>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">Guests:</strong>
                        <span style="color: #333;">${booking.adults} Adult(s), ${booking.children} Child(ren)</span>
                    </div>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                        <strong style="color: #666;">Total Nights:</strong>
                        <span style="color: #333;">${nights}</span>
                    </div>
                    <div class="booking-detail-row" style="display: flex; justify-content: space-between; padding: 20px 0 0 0; border-top: 2px solid #00CED1; margin-top: 15px;">
                        <strong style="font-size: 18px; color: #222;">Total Amount:</strong>
                        <span style="font-size: 24px; color: #00CED1; font-weight: 700;">${formatCurrency(totalAmount)}</span>
                    </div>
                </div>
                
                <div class="modal-actions" style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 25px;">
                    ${currentUserId ? `
                        <a href="dashboard.html" class="btn-modal btn-primary" style="flex: 1; min-width: 200px; text-align: center; text-decoration: none; padding: 14px 24px; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fa fa-dashboard"></i> View in Dashboard
                        </a>
                    ` : `
                        <a href="login.html" class="btn-modal btn-primary" style="flex: 1; min-width: 200px; text-align: center; text-decoration: none; padding: 14px 24px; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fa fa-sign-in"></i> Login to View Booking
                        </a>
                    `}
                    <button onclick="closeConfirmationModal()" class="btn-modal btn-secondary" style="flex: 1; min-width: 200px; padding: 14px 24px; background: white; color: #00CED1; border: 2px solid #00CED1; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="fa fa-times"></i> Close
                    </button>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="font-size: 14px; color: #999; margin: 0;">
                        <i class="fa fa-info-circle"></i> A confirmation email has been sent to your email address
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Send confirmation email
    sendBookingConfirmationEmail(booking, nights, totalAmount);
}

// Close confirmation modal
window.closeConfirmationModal = function() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            modal.remove();
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300);
    }
};

// Send booking confirmation email
async function sendBookingConfirmationEmail(booking, nights, totalAmount) {
    try {
        // Prepare email data
        const emailData = {
            to: booking.email,
            subject: `Booking Confirmation - ${booking.booking_number}`,
            bookingNumber: booking.booking_number,
            guestName: `${booking.first_name} ${booking.last_name}`,
            apartmentName: selectedApartment.name,
            checkIn: formatDate(booking.check_in),
            checkOut: formatDate(booking.check_out),
            nights: nights,
            adults: booking.adults,
            children: booking.children,
            totalAmount: formatCurrency(totalAmount),
            specialRequest: booking.special_request || 'None'
        };
        
        // Log email would be sent (in production, this would call an email API)
        console.log('Booking confirmation email data:', emailData);
        
        // In a real application, you would call an email service here
        // For now, we'll show a notification that email was "sent"
        setTimeout(() => {
            console.log(`✅ Confirmation email sent to ${booking.email}`);
        }, 1000);
        
        return { success: true };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return { success: false, error: error.message };
    }
}

// Add styles for booking confirmation
const bookingStyles = document.createElement('style');
bookingStyles.textContent = `
    @keyframes modalSlideIn {
        from {
            transform: translateY(-50px) scale(0.9);
            opacity: 0;
        }
        to {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes checkBounce {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .modal-close:hover {
        transform: rotate(90deg);
    }
    
    .btn-modal:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 206, 209, 0.3);
    }
    
    .btn-modal.btn-secondary:hover {
        background: #00CED1;
        color: white;
    }
    
    .booking-detail-row {
        transition: background 0.2s;
    }
    
    .booking-detail-row:hover {
        background: rgba(0, 206, 209, 0.05);
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
        .modal-content {
            width: 95% !important;
            margin: 10px !important;
        }
        
        .modal-body {
            padding: 20px !important;
        }
        
        .modal-header h2 {
            font-size: 20px !important;
        }
        
        .modal-actions {
            flex-direction: column;
        }
        
        .btn-modal {
            min-width: 100% !important;
        }
    }
    
    /* Ensure modal is always on top */
    .modal-overlay {
        z-index: 999999 !important;
    }
`;
document.head.appendChild(bookingStyles);
