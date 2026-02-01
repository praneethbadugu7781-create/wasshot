/**
 * WASSHOT STUDIO - Premium Booking System
 * Multi-step booking with WhatsApp integration
 * Built by UXI
 * 
 * @version 2.0.0
 */

// ================================================
// CONFIGURATION - REDUCED PRICES
// ================================================
const BOOKING_CONFIG = {
    whatsappNumbers: [
        '+917396986817', // Founder - Wasim Akram
        '+917330820239'  // Team07x
    ],
    totalSteps: 5,
    packages: {
        basic: {
            name: 'Basic Package',
            price: '₹2,499',
            priceValue: 2499,
            features: [
                '30 Second Reel',
                'Basic Editing',
                'Same Day Delivery',
                '1 Revision',
                'Digital Delivery'
            ]
        },
        premium: {
            name: 'Premium Package',
            price: '₹4,999',
            priceValue: 4999,
            features: [
                '60 Second Reel',
                'Advanced Editing',
                'Color Grading',
                '3 Hour Delivery',
                '3 Revisions',
                'Background Music'
            ]
        },
        pro: {
            name: 'Pro Package',
            price: '₹8,999',
            priceValue: 8999,
            features: [
                '90 Second Reel',
                'Cinematic Editing',
                'Premium Effects',
                '2 Hour Delivery',
                'Unlimited Revisions',
                'Raw Footage',
                'Multiple Formats'
            ]
        }
    },
    eventTypes: [
        { id: 'wedding', name: 'Wedding', icon: 'heart' },
        { id: 'birthday', name: 'Birthday', icon: 'cake' },
        { id: 'corporate', name: 'Corporate', icon: 'briefcase' },
        { id: 'engagement', name: 'Engagement', icon: 'ring' },
        { id: 'reception', name: 'Reception', icon: 'party' },
        { id: 'other', name: 'Other', icon: 'star' }
    ]
};

// ================================================
// STATE MANAGEMENT
// ================================================
let bookingState = {
    currentStep: 1,
    eventType: '',
    date: '',
    time: '',
    package: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
};

// ================================================
// DOM ELEMENTS
// ================================================
let formSteps = [];
let progressSteps = [];
let prevBtn = null;
let nextBtn = null;

// ================================================
// INITIALIZATION
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    initBookingForm();
});

function initBookingForm() {
    // Get DOM elements
    formSteps = document.querySelectorAll('.form-step');
    progressSteps = document.querySelectorAll('.progress-step');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    
    if (!formSteps.length) return;
    
    // Setup event listeners
    setupEventOptions();
    setupPackageOptions();
    setupFormInputs();
    setupNavigation();
    
    // Initialize first step
    updateStep(1);
}

// ================================================
// EVENT TYPE SELECTION
// ================================================
function setupEventOptions() {
    const eventOptions = document.querySelectorAll('.event-option');
    
    eventOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected from all
            eventOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to clicked
            option.classList.add('selected');
            
            // Update state
            bookingState.eventType = option.dataset.event;
            
            // Add selection animation
            option.style.transform = 'scale(0.95)';
            setTimeout(() => {
                option.style.transform = '';
            }, 150);
        });
    });
}

// ================================================
// PACKAGE SELECTION
// ================================================
function setupPackageOptions() {
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            packageCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected to clicked
            card.classList.add('selected');
            
            // Update state
            bookingState.package = card.dataset.package;
            
            // Add selection animation
            card.style.transform = 'translateY(-12px) scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        });
    });
}

// ================================================
// FORM INPUTS
// ================================================
function setupFormInputs() {
    // Name input
    const nameInput = document.getElementById('booking-name');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            bookingState.name = e.target.value;
        });
    }
    
    // Email input
    const emailInput = document.getElementById('booking-email');
    if (emailInput) {
        emailInput.addEventListener('input', (e) => {
            bookingState.email = e.target.value;
        });
    }
    
    // Phone input
    const phoneInput = document.getElementById('booking-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            bookingState.phone = e.target.value;
        });
    }
    
    // Date input
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        dateInput.addEventListener('change', (e) => {
            bookingState.date = e.target.value;
        });
    }
    
    // Time picker (clock style)
    const hourSelect = document.getElementById('booking-hour');
    const minuteSelect = document.getElementById('booking-minute');
    const periodSelect = document.getElementById('booking-period');
    const timeInput = document.getElementById('booking-time');
    
    function updateTimeValue() {
        if (hourSelect && minuteSelect && periodSelect && timeInput) {
            const hour = hourSelect.value;
            const minute = minuteSelect.value;
            const period = periodSelect.value;
            const timeString = `${hour}:${minute} ${period}`;
            timeInput.value = timeString;
            bookingState.time = timeString;
        }
    }
    
    if (hourSelect) hourSelect.addEventListener('change', updateTimeValue);
    if (minuteSelect) minuteSelect.addEventListener('change', updateTimeValue);
    if (periodSelect) periodSelect.addEventListener('change', updateTimeValue);
    
    // Initialize time value
    updateTimeValue();
    
    // Notes input
    const notesInput = document.getElementById('booking-notes');
    if (notesInput) {
        notesInput.addEventListener('input', (e) => {
            bookingState.notes = e.target.value;
        });
    }
}

// ================================================
// NAVIGATION
// ================================================
function setupNavigation() {
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (bookingState.currentStep > 1) {
                updateStep(bookingState.currentStep - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (bookingState.currentStep < BOOKING_CONFIG.totalSteps) {
                    updateStep(bookingState.currentStep + 1);
                } else {
                    submitBooking();
                }
            }
        });
    }
}

// ================================================
// STEP MANAGEMENT
// ================================================
function updateStep(step) {
    bookingState.currentStep = step;
    
    // Update form steps visibility
    formSteps.forEach((formStep, index) => {
        formStep.classList.remove('active');
        if (index + 1 === step) {
            formStep.classList.add('active');
        }
    });
    
    // Update progress indicators
    progressSteps.forEach((progressStep, index) => {
        progressStep.classList.remove('active', 'completed');
        if (index + 1 === step) {
            progressStep.classList.add('active');
        } else if (index + 1 < step) {
            progressStep.classList.add('completed');
        }
    });
    
    // Update navigation buttons
    if (prevBtn) {
        prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    }
    
    if (nextBtn) {
        if (step === BOOKING_CONFIG.totalSteps) {
            nextBtn.innerHTML = `
                <span>Confirm & Book</span>
                <svg class="btn-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
        } else {
            nextBtn.innerHTML = `
                <span>Continue</span>
                <svg class="btn-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
            `;
        }
    }
    
    // Update preview on last step
    if (step === BOOKING_CONFIG.totalSteps) {
        updatePreview();
    }
    
    // Scroll to top of form
    const bookingContainer = document.querySelector('.booking-container');
    if (bookingContainer) {
        bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ================================================
// VALIDATION
// ================================================
function validateCurrentStep() {
    switch (bookingState.currentStep) {
        case 1:
            if (!bookingState.eventType) {
                showToast('Please select an event type', 'error');
                return false;
            }
            break;
        case 2:
            if (!bookingState.package) {
                showToast('Please select a package', 'error');
                return false;
            }
            break;
        case 3:
            if (!bookingState.date || !bookingState.time) {
                showToast('Please select date and time', 'error');
                return false;
            }
            break;
        case 4:
            if (!bookingState.name || !bookingState.phone) {
                showToast('Please fill in required fields', 'error');
                return false;
            }
            if (!validatePhone(bookingState.phone)) {
                showToast('Please enter a valid phone number', 'error');
                return false;
            }
            if (bookingState.email && !validateEmail(bookingState.email)) {
                showToast('Please enter a valid email', 'error');
                return false;
            }
            break;
    }
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\d\s-]{10,}$/;
    return re.test(phone);
}

// ================================================
// PREVIEW UPDATE
// ================================================
function updatePreview() {
    const previewItems = {
        'preview-event': formatEventType(bookingState.eventType),
        'preview-package': BOOKING_CONFIG.packages[bookingState.package]?.name || '-',
        'preview-price': BOOKING_CONFIG.packages[bookingState.package]?.price || '-',
        'preview-date': formatDate(bookingState.date),
        'preview-time': formatTime(bookingState.time),
        'preview-name': bookingState.name || '-',
        'preview-phone': bookingState.phone || '-',
        'preview-email': bookingState.email || '-'
    };
    
    Object.entries(previewItems).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function formatEventType(type) {
    const event = BOOKING_CONFIG.eventTypes.find(e => e.id === type);
    return event ? event.name : '-';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ================================================
// BOOKING SUBMISSION
// ================================================
function submitBooking() {
    const message = generateWhatsAppMessage();
    
    // Show confirmation
    showConfirmation();
    
    // Open WhatsApp after short delay
    setTimeout(() => {
        const primaryNumber = BOOKING_CONFIG.whatsappNumbers[0].replace('+', '');
        const whatsappUrl = `https://wa.me/${primaryNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

function generateWhatsAppMessage() {
    const pkg = BOOKING_CONFIG.packages[bookingState.package];
    
    return `🎬 *WASSHOT STUDIO BOOKING*

━━━━━━━━━━━━━━━━━

📋 *Booking Details*

▸ Event Type: ${formatEventType(bookingState.eventType)}
▸ Package: ${pkg?.name || '-'}
▸ Price: ${pkg?.price || '-'}
▸ Date: ${formatDate(bookingState.date)}
▸ Time: ${formatTime(bookingState.time)}

━━━━━━━━━━━━━━━━━

👤 *Customer Information*

▸ Name: ${bookingState.name}
▸ Phone: ${bookingState.phone}
▸ Email: ${bookingState.email || 'Not provided'}

━━━━━━━━━━━━━━━━━

${bookingState.notes ? `📝 *Additional Notes*\n${bookingState.notes}\n\n━━━━━━━━━━━━━━━━━\n\n` : ''}✨ Looking forward to capturing your special moments!

_Sent via WASSHOT Website_`;
}

// ================================================
// CONFIRMATION SCREEN
// ================================================
function showConfirmation() {
    const formContent = document.querySelector('.booking-form');
    const confirmationScreen = document.querySelector('.confirmation-screen');
    
    if (formContent && confirmationScreen) {
        formContent.style.display = 'none';
        confirmationScreen.style.display = 'block';
        
        // Trigger confetti
        createConfetti();
    }
}

// ================================================
// CONFETTI EFFECT
// ================================================
function createConfetti() {
    const colors = ['#e8c4a0', '#8b5cf6', '#22d3ee', '#f5dfc5', '#a78bfa'];
    const confettiCount = 150;
    const container = document.querySelector('.confirmation-screen');
    
    if (!container) return;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -20px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: ${Math.random() * 0.5 + 0.5};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            pointer-events: none;
        `;
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Add confetti animation if not exists
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ================================================
// TOAST NOTIFICATIONS
// ================================================
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${type === 'error' 
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
            }
        </svg>
        <span>${message}</span>
    `;
    
    // Add toast styles if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                padding: 16px 24px;
                background: var(--color-bg-elevated);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1000;
                animation: toastIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                box-shadow: var(--shadow-lg);
            }
            .toast-error {
                border-color: #ef4444;
            }
            .toast-error svg {
                color: #ef4444;
            }
            .toast-success {
                border-color: var(--color-accent);
            }
            .toast-success svg {
                color: var(--color-accent);
            }
            @keyframes toastIn {
                to {
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ================================================
// EXPORT FOR MODULE USE
// ================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOOKING_CONFIG, bookingState };
}
