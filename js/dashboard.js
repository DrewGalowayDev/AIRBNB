// =====================================================
// DASHBOARD BACKEND HANDLER
// =====================================================

let currentUser = null;
let userProfile = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    await checkDashboardAuth();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup logout functionality
    setupLogoutHandler();
    
    // Setup booking action handlers
    setupBookingHandlers();
});

// Check if user is authenticated
async function checkDashboardAuth() {
    const authenticated = await isAuthenticated();
    
    if (!authenticated) {
        // Redirect to login if not authenticated
        showNotification('Please login to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Get current user
    const userResult = await getCurrentUser();
    if (userResult.success) {
        currentUser = userResult.user;
    }
}

// Load all dashboard data
async function loadDashboardData() {
    if (!currentUser) return;
    
    try {
        // Show loading state
        showDashboardLoading();
        
        // Load user profile
        await loadUserProfile();
        
        // Load booking statistics
        await loadBookingStats();
        
        // Load user bookings
        await loadUserBookings();
        
        // Load favorites count
        await loadFavoritesCount();
        
        // Hide loading state
        hideDashboardLoading();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Load user profile
async function loadUserProfile() {
    const result = await getUserProfile(currentUser.id);
    
    if (result.success && result.data) {
        userProfile = result.data;
        updateProfileDisplay();
    } else {
        // Use default data from auth
        userProfile = {
            full_name: currentUser.user_metadata?.full_name || 'User',
            email: currentUser.email,
            phone: currentUser.user_metadata?.phone || 'Not provided',
            location: 'Not provided',
            member_since: currentUser.created_at
        };
        updateProfileDisplay();
    }
}

// Update profile display in dashboard
function updateProfileDisplay() {
    // Update welcome message
    const welcomeHeader = document.querySelector('.dashboard-header h1');
    if (welcomeHeader) {
        const firstName = userProfile.full_name.split(' ')[0];
        welcomeHeader.textContent = `Welcome back, ${firstName}!`;
    }
    
    // Update profile section
    const profileName = document.querySelector('.profile-info h3');
    if (profileName) {
        profileName.textContent = userProfile.full_name;
    }
    
    // Update avatar initials
    const avatarElement = document.querySelector('.profile-avatar');
    if (avatarElement) {
        const initials = userProfile.full_name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        avatarElement.textContent = initials;
    }
    
    // Update member since
    const memberSince = document.querySelector('.profile-info p');
    if (memberSince) {
        const date = new Date(userProfile.member_since);
        memberSince.textContent = `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    
    // Update profile details
    const emailDetail = document.querySelector('.profile-detail:has(i.fa-envelope) span');
    if (emailDetail) {
        emailDetail.textContent = userProfile.email || currentUser.email;
    }
    
    const phoneDetail = document.querySelector('.profile-detail:has(i.fa-phone) span');
    if (phoneDetail) {
        phoneDetail.textContent = userProfile.phone || 'Not provided';
    }
    
    const locationDetail = document.querySelector('.profile-detail:has(i.fa-map-marker) span');
    if (locationDetail) {
        locationDetail.textContent = userProfile.location || 'Not provided';
    }
}

// Load booking statistics
async function loadBookingStats() {
    const result = await getBookingStats(currentUser.id);
    
    if (result.success && result.data) {
        const stats = result.data;
        
        // Update stat cards
        updateStatCard(0, stats.total_bookings || 0);
        updateStatCard(1, stats.pending_bookings || 0);
        updateStatCard(2, stats.confirmed_bookings || 0);
    }
}

// Update individual stat card
function updateStatCard(index, value) {
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards[index]) {
        statCards[index].textContent = value;
    }
}

// Load user bookings
async function loadUserBookings() {
    const result = await getUserBookings(currentUser.id);
    
    if (result.success && result.data) {
        displayBookings(result.data);
    } else {
        displayNoBookings();
    }
}

// Display bookings
function displayBookings(bookings) {
    const bookingsContainer = document.querySelector('#dashboard .dashboard-section:has(h2 i.fa-list)');
    if (!bookingsContainer) return;
    
    // Remove loading spinner
    const loadingSpinner = bookingsContainer.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
    
    // Clear existing bookings
    const existingBookings = bookingsContainer.querySelectorAll('.booking-card');
    existingBookings.forEach(card => card.remove());
    
    // Clear no-bookings message if exists
    const noBookingsMsg = bookingsContainer.querySelector('.no-bookings');
    if (noBookingsMsg) {
        noBookingsMsg.remove();
    }
    
    if (bookings.length === 0) {
        displayNoBookings();
        return;
    }
    
    // Create booking cards
    const h2Element = bookingsContainer.querySelector('h2');
    
    bookings.forEach(booking => {
        const bookingCard = createBookingCard(booking);
        h2Element.insertAdjacentHTML('afterend', bookingCard);
    });
    
    // Re-setup booking handlers after adding new cards
    setupBookingHandlers();
}

// Create booking card HTML
function createBookingCard(booking) {
    const statusClass = booking.status.toLowerCase();
    const statusText = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
    
    const checkInDate = formatDate(booking.check_in);
    const checkOutDate = formatDate(booking.check_out);
    const apartmentName = booking.apartments?.name || 'Apartment';
    
    return `
    <div class="booking-card" data-booking-id="${booking.id}">
        <div class="booking-header">
            <span class="booking-id"><i class="fa fa-hashtag"></i> ${booking.booking_number}</span>
            <span class="status ${statusClass}">${statusText}</span>
        </div>
        <div class="booking-details">
            <div class="booking-detail">
                <i class="fa fa-home"></i>
                <span>${apartmentName}</span>
            </div>
            <div class="booking-detail">
                <i class="fa fa-calendar"></i>
                <span>${checkInDate} - ${checkOutDate}</span>
            </div>
            <div class="booking-detail">
                <i class="fa fa-users"></i>
                <span>${booking.adults} Adult${booking.adults > 1 ? 's' : ''}${booking.children > 0 ? ', ' + booking.children + ' Child' + (booking.children > 1 ? 'ren' : '') : ''}</span>
            </div>
            <div class="booking-detail">
                <i class="fa fa-moon-o"></i>
                <span>${booking.total_nights} Night${booking.total_nights > 1 ? 's' : ''}</span>
            </div>
            <div class="booking-detail">
                <i class="fa fa-money"></i>
                <span>${formatCurrency(booking.total_amount)}</span>
            </div>
        </div>
        <div class="booking-actions">
            <button class="btn-sm btn-primary view-booking" data-booking-id="${booking.id}">
                <i class="fa fa-eye"></i> View Details
            </button>
            ${booking.status === 'confirmed' || booking.status === 'pending' ? `
                <button class="btn-sm btn-danger cancel-booking" data-booking-id="${booking.id}">
                    <i class="fa fa-times"></i> Cancel
                </button>
            ` : ''}
            ${booking.status === 'completed' ? `
                <button class="btn-sm btn-outline">
                    <i class="fa fa-star"></i> Write Review
                </button>
                <button class="btn-sm btn-outline">
                    <i class="fa fa-refresh"></i> Book Again
                </button>
            ` : ''}
        </div>
    </div>
    `;
}

// Display no bookings message
function displayNoBookings() {
    const bookingsContainer = document.querySelector('#dashboard .dashboard-section:has(h2 i.fa-list)');
    if (!bookingsContainer) return;
    
    // Remove loading spinner
    const loadingSpinner = bookingsContainer.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
    
    const h2Element = bookingsContainer.querySelector('h2');
    const noBookingsHTML = `
    <div class="no-bookings">
        <i class="fa fa-calendar-times-o"></i>
        <h3>No Bookings Yet</h3>
        <p>You haven't made any bookings yet. Start exploring our apartments!</p>
        <a href="booking.html" class="btn-sm btn-primary">Make a Booking</a>
    </div>
    `;
    
    h2Element.insertAdjacentHTML('afterend', noBookingsHTML);
}

// Load favorites count
async function loadFavoritesCount() {
    const result = await getFavoritesCount(currentUser.id);
    
    if (result.success) {
        updateStatCard(3, result.count || 0);
    }
}

// Setup booking action handlers
function setupBookingHandlers() {
    // View booking details
    const viewButtons = document.querySelectorAll('.view-booking');
    viewButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const bookingId = this.dataset.bookingId;
            await viewBookingDetails(bookingId);
        });
    });
    
    // Cancel booking
    const cancelButtons = document.querySelectorAll('.cancel-booking');
    cancelButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const bookingId = this.dataset.bookingId;
            await handleCancelBooking(bookingId, this);
        });
    });
}

// View booking details
async function viewBookingDetails(bookingId) {
    const result = await getBooking(bookingId);
    
    if (result.success && result.data) {
        showBookingDetailsModal(result.data);
    } else {
        showNotification('Error loading booking details', 'error');
    }
}

// Show booking details modal
function showBookingDetailsModal(booking) {
    const modalHTML = `
    <div class="modal-overlay" id="bookingModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Booking Details</h2>
                <button class="modal-close" onclick="closeBookingModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="booking-detail-row">
                    <strong>Booking Number:</strong>
                    <span>${booking.booking_number}</span>
                </div>
                <div class="booking-detail-row">
                    <strong>Apartment:</strong>
                    <span>${booking.apartments?.name || 'N/A'}</span>
                </div>
                <div class="booking-detail-row">
                    <strong>Location:</strong>
                    <span>${booking.apartments?.location || 'N/A'}</span>
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
                    <span>${booking.total_nights}</span>
                </div>
                <div class="booking-detail-row">
                    <strong>Total Amount:</strong>
                    <span>${formatCurrency(booking.total_amount)}</span>
                </div>
                <div class="booking-detail-row">
                    <strong>Status:</strong>
                    <span class="status ${booking.status}">${booking.status.toUpperCase()}</span>
                </div>
                ${booking.special_request ? `
                <div class="booking-detail-row">
                    <strong>Special Request:</strong>
                    <span>${booking.special_request}</span>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close booking modal
window.closeBookingModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.remove();
    }
};

// Handle cancel booking
async function handleCancelBooking(bookingId, buttonElement) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    showLoading(buttonElement, 'Cancelling...');
    
    const result = await cancelBooking(bookingId);
    
    if (result.success) {
        showNotification('Booking cancelled successfully', 'success');
        
        // Reload bookings
        await loadUserBookings();
        await loadBookingStats();
    } else {
        showNotification('Error cancelling booking: ' + result.error, 'error');
        hideLoading(buttonElement);
    }
}

// Setup logout handler
function setupLogoutHandler() {
    const logoutButtons = document.querySelectorAll('.logout-btn, a[href*="logout"]');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                await signOut();
            }
        });
    });
}

// Show dashboard loading
function showDashboardLoading() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.opacity = '0.5';
        dashboard.style.pointerEvents = 'none';
    }
}

// Hide dashboard loading
function hideDashboardLoading() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.opacity = '1';
        dashboard.style.pointerEvents = 'auto';
    }
}

// Add modal and additional styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .no-bookings .btn-sm {
        display: inline-block;
        text-decoration: none;
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-content {
        background: white;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease-out;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        border-bottom: 2px solid #00CED1;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #222;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 32px;
        color: #666;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-close:hover {
        color: #00CED1;
    }
    
    .modal-body {
        padding: 30px;
    }
    
    .booking-detail-row {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .booking-detail-row:last-child {
        border-bottom: none;
    }
    
    .booking-detail-row strong {
        color: #666;
        font-weight: 600;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(modalStyles);
