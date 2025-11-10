// =====================================================
// BOOKING PAGE INITIALIZATION
// =====================================================
// This file is now handled by booking-handler.js for Supabase integration
// Keeping minimal jQuery functionality for other page elements

$(function () { 
    // Tab functionality (if needed)
    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
    
    // Clear success messages on focus
    $('#fname, #lname, #email, #mobile').focus(function () {
        $('#success').html('');
    });
    
    // Note: Form submission is now handled by booking-handler.js
    // which uses Supabase for backend instead of PHP mail
});
