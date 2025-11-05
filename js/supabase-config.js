// =====================================================
// SUPABASE CONFIGURATION
// =====================================================
// Instructions:
// 1. Go to your Supabase project dashboard
// 2. Go to Settings > API
// 3. Copy your Project URL and anon/public key
// 4. Replace the values below with your actual credentials
// =====================================================

const SUPABASE_URL = 'https://hexdqhqycavleqbbnndr.supabase.co'; // e.g., https://xxxxxxxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleGRxaHF5Y2F2bGVxYmJubmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjQ2MTYsImV4cCI6MjA3Nzk0MDYxNn0.klRMT7i96o14TSRAvN2sMuy5jKvh9cLSXWQQbKXwHpg'; // Your public anon key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

// Sign Up
async function signUp(email, password, fullName, phone) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone
                }
            }
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

// Sign In
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Sign Out
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// Get Current User
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        return { success: true, user };
    } catch (error) {
        console.error('Get user error:', error);
        return { success: false, error: error.message };
    }
}

// Check if user is authenticated
async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return session !== null;
}

// Get user session
async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// =====================================================
// PROFILE FUNCTIONS
// =====================================================

// Get user profile
async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get profile error:', error);
        return { success: false, error: error.message };
    }
}

// Update user profile
async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
    }
}

// =====================================================
// BOOKING FUNCTIONS
// =====================================================

// Check apartment availability
async function checkAvailability(apartmentId, checkIn, checkOut) {
    try {
        const { data, error } = await supabase
            .rpc('check_apartment_availability', {
                p_apartment_id: apartmentId,
                p_check_in: checkIn,
                p_check_out: checkOut
            });

        if (error) throw error;

        return { success: true, available: data };
    } catch (error) {
        console.error('Check availability error:', error);
        return { success: false, error: error.message };
    }
}

// Create booking
async function createBooking(bookingData) {
    try {
        // First check availability
        const availabilityCheck = await checkAvailability(
            bookingData.apartment_id,
            bookingData.check_in,
            bookingData.check_out
        );

        if (!availabilityCheck.available) {
            throw new Error('Apartment is not available for the selected dates');
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Create booking error:', error);
        return { success: false, error: error.message };
    }
}

// Get user bookings
async function getUserBookings(userId) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                apartments (
                    name,
                    location,
                    images
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get bookings error:', error);
        return { success: false, error: error.message };
    }
}

// Get single booking
async function getBooking(bookingId) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                apartments (
                    name,
                    location,
                    images,
                    amenities
                )
            `)
            .eq('id', bookingId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get booking error:', error);
        return { success: false, error: error.message };
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: status })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Update booking status error:', error);
        return { success: false, error: error.message };
    }
}

// Cancel booking
async function cancelBooking(bookingId) {
    return await updateBookingStatus(bookingId, 'cancelled');
}

// Get booking statistics
async function getBookingStats(userId) {
    try {
        const { data, error } = await supabase
            .from('user_booking_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get booking stats error:', error);
        // Return default stats if no bookings exist
        return { 
            success: true, 
            data: {
                total_bookings: 0,
                pending_bookings: 0,
                confirmed_bookings: 0,
                completed_bookings: 0,
                cancelled_bookings: 0
            }
        };
    }
}

// =====================================================
// APARTMENT FUNCTIONS
// =====================================================

// Get all apartments
async function getApartments() {
    try {
        const { data, error } = await supabase
            .from('apartments')
            .select('*')
            .eq('is_available', true);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get apartments error:', error);
        return { success: false, error: error.message };
    }
}

// Get single apartment
async function getApartment(apartmentId) {
    try {
        const { data, error } = await supabase
            .from('apartments')
            .select('*')
            .eq('id', apartmentId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get apartment error:', error);
        return { success: false, error: error.message };
    }
}

// =====================================================
// FAVORITES FUNCTIONS
// =====================================================

// Add to favorites
async function addToFavorites(userId, apartmentId) {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, apartment_id: apartmentId }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Add to favorites error:', error);
        return { success: false, error: error.message };
    }
}

// Remove from favorites
async function removeFromFavorites(userId, apartmentId) {
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('apartment_id', apartmentId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Remove from favorites error:', error);
        return { success: false, error: error.message };
    }
}

// Get user favorites
async function getUserFavorites(userId) {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select(`
                *,
                apartments (*)
            `)
            .eq('user_id', userId);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get favorites error:', error);
        return { success: false, error: error.message };
    }
}

// Get favorites count
async function getFavoritesCount(userId) {
    try {
        const { count, error } = await supabase
            .from('favorites')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) throw error;

        return { success: true, count };
    } catch (error) {
        console.error('Get favorites count error:', error);
        return { success: false, error: error.message };
    }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Calculate number of nights
function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
    }).format(amount);
}

// Show loading state
function showLoading(buttonElement, loadingText = 'Loading...') {
    if (buttonElement) {
        buttonElement.dataset.originalText = buttonElement.textContent;
        buttonElement.textContent = loadingText;
        buttonElement.disabled = true;
    }
}

// Hide loading state
function hideLoading(buttonElement) {
    if (buttonElement && buttonElement.dataset.originalText) {
        buttonElement.textContent = buttonElement.dataset.originalText;
        buttonElement.disabled = false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
