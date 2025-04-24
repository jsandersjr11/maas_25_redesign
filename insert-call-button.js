/**
 * Dynamic Call Button Script
 * Updates phone number in call button based on localStorage data
 * @version 1.0.0
 */

(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        updateInterval: 2000,          // Update interval in milliseconds
        targetClass: '.dynamicnumberctaheader',
        storageKey: 'mapi',           // localStorage key
        requiredMatches: 3            // Number of consecutive matches required to stop checking
    };

    // Track consecutive matches
    let lastPhoneNumber = null;
    let matchCount = 0;

    /**
     * Formats a phone number into a standardized format
     * @param {string|number} number - The phone number to format
     * @returns {string|null} Formatted phone number or null if invalid
     */
    const formatPhoneNumber = (number) => {
        if (!number) return null;
        try {
            const cleaned = number.toString().replace(/\D/g, '');
            if (cleaned.length !== 10) return null;
            return '1-' + cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } catch (error) {
            console.warn('Error formatting phone number:', error);
            return null;
        }
    };

    /**
     * Creates the button HTML with the provided phone number
     * @param {string} formattedNumber - The formatted phone number
     * @returns {string} HTML string for the button
     */
    const createButtonHTML = (formattedNumber) => {
        const sanitizedNumber = formattedNumber.replace(/[<>"'&]/g, ''); // Prevent XSS
        return `
            <a href="tel:${sanitizedNumber}" class="call-button">
                <div class="phone-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                </div>
                <span class="call-text">Call Today!</span>
            </a>
        `;
    };

    /**
     * Updates the button with the current phone number from localStorage
     * If no valid number is found, the button will be hidden
     * @returns {void}
     */
    const updatePhoneButton = () => {
        const targetElement = document.querySelector(CONFIG.targetClass);
        if (!targetElement) return;

        try {
            // Get and parse the storage value
            const mapiValue = localStorage.getItem(CONFIG.storageKey);
            const knownTokens = mapiValue ? JSON.parse(mapiValue)?.knownTokens : null;

            // Find and format the first valid phone number
            const phoneNumber = knownTokens 
                ? Object.values(knownTokens).find(value => formatPhoneNumber(value))
                : null;

            const formattedNumber = phoneNumber ? formatPhoneNumber(phoneNumber) : null;

            // Check for consecutive matches
            if (formattedNumber === lastPhoneNumber) {
                matchCount++;
                if (matchCount >= CONFIG.requiredMatches && updateInterval) {
                    console.log('Phone number stable after ' + CONFIG.requiredMatches + ' consecutive matches. Stopping checks.');
                    clearInterval(updateInterval);
                }
            } else {
                matchCount = 1;
                lastPhoneNumber = formattedNumber;
            }

            if (formattedNumber) {
                // Show button with valid number
                targetElement.style.display = '';
                targetElement.innerHTML = createButtonHTML(formattedNumber);
            } else {
                // Hide button when no valid number is available
                targetElement.style.display = 'none';
                targetElement.innerHTML = '';
            }
        } catch (error) {
            console.error('Error updating phone button:', error);
            // Hide button on error
            targetElement.style.display = 'none';
            targetElement.innerHTML = '';
        }
    };

    // Initialize when DOM is ready
    let updateInterval; // Make updateInterval accessible to updatePhoneButton
    
    const init = () => {
        try {
            // Reset tracking variables
            lastPhoneNumber = null;
            matchCount = 0;

            // Initial update
            updatePhoneButton();

            // Set up interval for updates
            updateInterval = setInterval(updatePhoneButton, CONFIG.updateInterval);

            // Cleanup on page unload
            window.addEventListener('unload', () => {
                if (updateInterval) clearInterval(updateInterval);
            });
        } catch (error) {
            console.error('Error initializing phone button:', error);
            if (updateInterval) clearInterval(updateInterval);
        }
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
