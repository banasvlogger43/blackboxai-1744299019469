// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.fa-eye');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.closest('.relative').querySelector('input');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength indicator function
    function initPasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        // Create strength indicator elements if they don't exist
        if (!document.querySelector('.password-strength-container')) {
            const container = document.createElement('div');
            container.className = 'password-strength-container mt-2';
            
            // Create strength bars
            const barsContainer = document.createElement('div');
            barsContainer.className = 'flex space-x-1';
            
            for (let i = 0; i < 4; i++) {
                const bar = document.createElement('div');
                bar.className = 'password-strength w-1/4 h-1 bg-gray-200 rounded';
                barsContainer.appendChild(bar);
            }
            container.appendChild(barsContainer);
            
            // Create strength text
            const strengthText = document.createElement('p');
            strengthText.className = 'text-xs text-gray-500 mt-1';
            strengthText.innerHTML = 'Password strength: <span id="password-strength-text">Weak</span>';
            container.appendChild(strengthText);
            
            // Insert after password input
            passwordInput.parentElement.appendChild(container);
        }

        const strengthBars = document.querySelectorAll('.password-strength');
        const strengthText = document.getElementById('password-strength-text');

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            // Reset all bars
            strengthBars.forEach(bar => {
                bar.style.backgroundColor = '#e5e7eb'; // gray-200
            });
            
            // Check password strength
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;
            
            // Update strength bars
            for (let i = 0; i < strength; i++) {
                strengthBars[i].style.backgroundColor = getStrengthColor(strength);
            }
            
            // Update strength text
            if (strengthText) {
                strengthText.textContent = getStrengthText(strength);
                strengthText.style.color = getStrengthColor(strength);
            }

            // Check confirm password match
            const confirmPasswordInput = document.getElementById('confirm-password');
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validatePasswordMatch(password, confirmPasswordInput.value);
            }
        });

        // Add confirm password validation
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                const passwordInput = document.getElementById('password');
                validatePasswordMatch(passwordInput.value, this.value);
            });
        }
    }

    function validatePasswordMatch(password, confirmPassword) {
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (!confirmPasswordInput) return false;

        const errorMessage = confirmPasswordInput.parentElement.querySelector('.error-message');
        
        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add('border-red-500');
            if (!errorMessage) {
                const message = document.createElement('p');
                message.className = 'text-red-500 text-xs mt-1 error-message';
                message.textContent = 'Passwords do not match';
                confirmPasswordInput.parentElement.appendChild(message);
            }
            return false;
        } else {
            confirmPasswordInput.classList.remove('border-red-500');
            if (errorMessage) {
                errorMessage.remove();
            }
            return true;
        }
    }

    // Initialize password strength for signup page
    if (window.location.pathname.includes('signup.html')) {
        initPasswordStrength();
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showError(field, 'This field is required');
                } else {
                    removeError(field);
                }
            });
            
            // Email validation
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    showError(emailInput, 'Please enter a valid email address');
                }
            }
            
            // Password validation for signup form
            if (window.location.pathname.includes('signup.html')) {
                const passwordInput = form.querySelector('#password');
                const confirmPasswordInput = form.querySelector('#confirm-password');
                if (passwordInput && confirmPasswordInput) {
                    if (!validatePasswordMatch(passwordInput.value, confirmPasswordInput.value)) {
                        isValid = false;
                    }
                }
            }
            
            if (isValid) {
                showSuccessMessage('Form submitted successfully!');
                form.reset();
                
                // Reset password strength indicator
                const strengthBars = document.querySelectorAll('.password-strength');
                const strengthText = document.getElementById('password-strength-text');
                if (strengthBars && strengthText) {
                    strengthBars.forEach(bar => {
                        bar.style.backgroundColor = '#e5e7eb';
                    });
                    strengthText.textContent = 'Weak';
                    strengthText.style.color = '#e5e7eb';
                }
            }
        });
    });
});

// Helper functions
function showError(field, message) {
    field.classList.add('border-red-500');
    const existingError = field.parentElement.querySelector('.error-message');
    if (!existingError) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'text-red-500 text-xs mt-1 error-message';
        errorMessage.textContent = message;
        field.parentElement.appendChild(errorMessage);
    }
}

function removeError(field) {
    field.classList.remove('border-red-500');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
}

function getStrengthColor(strength) {
    switch (strength) {
        case 1: return '#ef4444'; // red-500
        case 2: return '#f59e0b'; // amber-500
        case 3: return '#10b981'; // emerald-500
        case 4: return '#059669'; // emerald-600
        default: return '#e5e7eb'; // gray-200
    }
}

function getStrengthText(strength) {
    switch (strength) {
        case 1: return 'Weak';
        case 2: return 'Fair';
        case 3: return 'Good';
        case 4: return 'Strong';
        default: return 'Weak';
    }
}
