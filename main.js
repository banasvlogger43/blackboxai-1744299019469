// Password visibility toggle
document.addEventListener('DOMContentLoaded', function() {
    const togglePasswordButtons = document.querySelectorAll('.fa-eye');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength indicator
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
        });
    }

    // Initialize password strength on page load
    document.addEventListener('DOMContentLoaded', initPasswordStrength);
});

// Get color based on password strength
function getStrengthColor(strength) {
    switch (strength) {
        case 1: return '#ef4444'; // red-500
        case 2: return '#f59e0b'; // amber-500
        case 3: return '#10b981'; // emerald-500
        case 4: return '#059669'; // emerald-600
        default: return '#e5e7eb'; // gray-200
    }
}

// Get text based on password strength
function getStrengthText(strength) {
    switch (strength) {
        case 1: return 'Weak';
        case 2: return 'Fair';
        case 3: return 'Good';
        case 4: return 'Strong';
        default: return 'Weak';
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'md:hidden';
    mobileMenu.innerHTML = `
        <div class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity hidden"></div>
        <div class="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 transform translate-x-full transition-transform duration-300">
            <div class="p-6">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold text-gray-900">Menu</h2>
                    <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <nav class="space-y-6">
                    <a href="properties.html" class="block text-gray-600 hover:text-blue-600">Properties</a>
                    <a href="#" class="block text-gray-600 hover:text-blue-600">About</a>
                    <a href="#" class="block text-gray-600 hover:text-blue-600">Contact</a>
                    <a href="login.html" class="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-center">Login</a>
                </nav>
            </div>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    const overlay = mobileMenu.querySelector('.bg-gray-800');
    const menuPanel = mobileMenu.querySelector('.fixed.inset-y-0');
    const closeButton = mobileMenu.querySelector('.fa-times').parentElement;
    
    function toggleMenu() {
        overlay.classList.toggle('hidden');
        menuPanel.classList.toggle('translate-x-full');
    }
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMenu);
    }
    
    closeButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Add error message if it doesn't exist
                    if (!field.nextElementSibling?.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.className = 'text-red-500 text-xs mt-1 error-message';
                        errorMessage.textContent = 'This field is required';
                        field.parentElement.appendChild(errorMessage);
                    }
                } else {
                    field.classList.remove('border-red-500');
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage?.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            // Email validation
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    emailInput.classList.add('border-red-500');
                    
                    if (!emailInput.nextElementSibling?.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.className = 'text-red-500 text-xs mt-1 error-message';
                        errorMessage.textContent = 'Please enter a valid email address';
                        emailInput.parentElement.appendChild(errorMessage);
                    }
                }
            }
            
            // Password validation for signup form
            const passwordInput = form.querySelector('#password');
            const confirmPasswordInput = form.querySelector('#confirm-password');
            if (passwordInput && confirmPasswordInput) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    isValid = false;
                    confirmPasswordInput.classList.add('border-red-500');
                    
                    if (!confirmPasswordInput.nextElementSibling?.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.className = 'text-red-500 text-xs mt-1 error-message';
                        errorMessage.textContent = 'Passwords do not match';
                        confirmPasswordInput.parentElement.appendChild(errorMessage);
                    }
                }
            }
            
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                successMessage.textContent = 'Form submitted successfully!';
                document.body.appendChild(successMessage);
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
                
                // Reset form
                form.reset();
            }
        });
    });
});
