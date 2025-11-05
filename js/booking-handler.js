// =====================================================
// BOOKING BACKEND HANDLER
// =====================================================

let selectedApartment = null;
let currentUserId = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Get current user if logged in
    await getCurrentUserInfo();
    
    // Load apartments
    await loadApartments();
    
    // Setup booking form
    setupBookingForm();
    
    // Setup date pickers
    setupDatePickers();
});

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
    const today = new Date().toISOString().split('T')[0];
    
    const checkInInput = document.querySelector('#date-1');
    const checkOutInput = document.querySelector('#date-2');
    
    if (checkInInput) {
        checkInInput.setAttribute('min', today);
        checkInInput.setAttribute('type', 'date');
        
        // Update checkout min date when checkin changes
        checkInInput.addEventListener('change', function() {
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
    }
    
    if (checkOutInput) {
        checkOutInput.setAttribute('min', today);
        checkOutInput.setAttribute('type', 'date');
    }
}

// Setup booking form
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleBookingSubmission(this);
        });
    }
}

// Handle booking form submission
async function handleBookingSubmission(form) {
    const submitBtn = form.querySelector('#bookingButton');
    
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
            user_id: currentUserId || null, // null for guest bookings
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
        };
        
        // Update button text
        submitBtn.textContent = 'Creating Booking...';
        
        // Create booking
        const result = await createBooking(bookingData);
        
        if (result.success) {
            showNotification('Booking created successfully!', 'success');
            
            // Show booking confirmation
            showBookingConfirmation(result.data, nights, totalAmount);
            
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
    <div class="modal-overlay" id="confirmationModal">
        <div class="modal-content">
            <div class="modal-header" style="background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white;">
                <h2><i class="fa fa-check-circle"></i> Booking Confirmed!</h2>
                <button class="modal-close" onclick="closeConfirmationModal()" style="color: white;">&times;</button>
            </div>
            <div class="modal-body">
                <div class="confirmation-message">
                    <p style="font-size: 18px; text-align: center; margin-bottom: 30px; color: #28a745;">
                        <i class="fa fa-check-circle" style="font-size: 48px; display: block; margin-bottom: 15px;"></i>
                        Your booking has been successfully created! We've sent a confirmation email to <strong>${booking.email}</strong>.
                    </p>
                </div>
                
                <div class="booking-summary" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #222; border-bottom: 2px solid #00CED1; padding-bottom: 10px;">
                        Booking Summary
                    </h3>
                    <div class="booking-detail-row">
                        <strong>Booking Number:</strong>
                        <span style="color: #00CED1; font-weight: 700;">${booking.booking_number}</span>
                    </div>
                    <div class="booking-detail-row">
                        <strong>Apartment:</strong>
                        <span>${selectedApartment.name}</span>
                    </div>
                    <div class="booking-detail-row">
                        <strong>Check-in:</strong>
                        <span>${formatDate(booking.check_in)}</span>
                    </div>
                    <div class="booking-detail-row">
                        <strong>Check-out:</strong>
                        <span>${formatDate(booking.check_out)}</span>
                    </div>
                    <div class="booking-detail-row">
                        <strong>Guests:</strong>
                        <span>${booking.adults} Adult(s), ${booking.children} Child(ren)</span>
                    </div>
                    <div class="booking-detail-row">
                        <strong>Total Nights:</strong>
                        <span>${nights}</span>
                    </div>
                    <div class="booking-detail-row" style="border-top: 2px solid #00CED1; padding-top: 15px; margin-top: 15px;">
                        <strong style="font-size: 18px;">Total Amount:</strong>
                        <span style="font-size: 20px; color: #00CED1; font-weight: 700;">${formatCurrency(totalAmount)}</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    ${currentUserId ? `
                        <a href="dashboard.html" class="btn-sm btn-primary" style="margin-right: 10px;">
                            <i class="fa fa-dashboard"></i> Go to Dashboard
                        </a>
                    ` : ''}
                    <button onclick="closeConfirmationModal()" class="btn-sm btn-outline">
                        <i class="fa fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close confirmation modal
window.closeConfirmationModal = function() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.remove();
    }
};

// Add styles for booking confirmation
const bookingStyles = document.createElement('style');
bookingStyles.textContent = `
    .confirmation-message i.fa-check-circle {
        color: #28a745;
    }
    
    .booking-summary {
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .btn-sm {
        display: inline-block;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 600;
        transition: all 0.3s;
    }
`;
document.head.appendChild(bookingStyles);
