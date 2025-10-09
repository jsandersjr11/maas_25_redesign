// <div class="dynamicnumbercta"></div>

// Get and parse the 'mapi' value from localStorage
const mapiValue = localStorage.getItem('mapi');
const knownTokens = mapiValue ? JSON.parse(mapiValue)?.knownTokens : null;

// Helper function to format phone number
const formatPhoneNumber = (number) => {
    if (!number) return null;
    return '1-' + number.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

// Find and replace phone number div
if (knownTokens) {
    Object.entries(knownTokens).forEach(([_, value]) => {
        const formattedNumber = formatPhoneNumber(value);
        if (formattedNumber) {
            const phoneLink = `<a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0" href="tel:${formattedNumber}" visibility="" data-gtm-vis-has-fired1533299_373="1">
                <button class="leshen-phone-cta convert-phone-button css-1wgi1cl ex50p320" color="primary" tabindex="0" type="button" data-gtm-vis-recent-on-screen1533299_337="76" data-gtm-vis-first-on-screen1533299_337="76" data-gtm-vis-total-visible-time1533299_337="100" data-gtm-vis-has-fired1533299_337="1">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img" fill="currentColor" class="css-12y56at">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                    </svg>
                    <span class="button-text css-14fum0t e1hk20aw0">Call Now</span>
                </button>
            </a>`;
            const targetDiv = document.querySelector('.dynamicnumbercta');
            if (targetDiv) {
                targetDiv.innerHTML = phoneLink;
            } else {
                console.error('Target div not found');
            }
        }
    });
} else {
    console.error('No tokens found in localStorage');
}
