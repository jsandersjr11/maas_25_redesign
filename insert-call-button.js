document.addEventListener('DOMContentLoaded', function() {
    // Helper function to format phone number
    const formatPhoneNumber = (number) => {
        if (!number) return null;
        return '1-' + number.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    };

    // Function to create button HTML
    const createButtonHTML = (formattedNumber) => {
        return `
            <a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0" href="tel:${formattedNumber}">
                <button class="leshen-phone-cta convert-phone-button css-1jzs64m ex50p320" color="primary" tabindex="0" type="button">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img" fill="currentColor" class="css-12y56at">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                    </svg>
                    <span class="button-text css-14fum0t e1hk20aw0">Order at <span class="css-1u5k9ll ejsd1ui0">${formattedNumber}</span></span>
                </button>
            </a>
        `;
    };

    // Function to update the button with phone number
    const updatePhoneButton = () => {
        const targetElement = document.querySelector('.dynamicnumberctaheader');
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }

        // Get and parse the 'mapi' value from localStorage
        const mapiValue = localStorage.getItem('mapi');
        const knownTokens = mapiValue ? JSON.parse(mapiValue)?.knownTokens : null;

        if (knownTokens) {
            // Find first valid phone number
            const phoneNumber = Object.values(knownTokens).find(value => formatPhoneNumber(value));
            if (phoneNumber) {
                targetElement.innerHTML = createButtonHTML(formatPhoneNumber(phoneNumber));
            } else {
                targetElement.innerHTML = createButtonHTML('+1234567890');
            }
        } else {
            targetElement.innerHTML = createButtonHTML('+1234567890');
        }
    };

    // Initial update
    updatePhoneButton();

    // Check for changes every 2 seconds
    setInterval(updatePhoneButton, 2000);
});
