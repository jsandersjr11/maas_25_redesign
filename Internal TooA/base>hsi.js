// CTLQ > HSI | Button
// Description: https://www.highspeedinternet.com/in-your-area?zip={zip}&kbid=172539
// HTML: <div class="gft-hsi-button"></div>
/**
 * HSI Button Replacement Script
 * This script replaces the HSI button div with an anchor link
 * and pulls the zip code from localStorage to insert in the href.
 * The script detects the current domain and applies the appropriate CSS class.
 */
// Domain-based CSS class lookup table
const domainClassMap = {
    'getquantumfiber': 'css-1vehp0y',
    'centurylink': 'css-1s55t5c',
    'highspeed.centurylink': 'css-1s55t5c',
    'centurylinkquote': 'css-1s55t5c',
    'getcenturylink': 'css-1rirpjz',
    'attsavings': 'css-1h8a45c',
    'attexperts': 'css-1cr3433',
    'frontierbundles': 'css-hnohsy',
    'go.frontier': 'css-hnohsy',
    'brightspeed': 'css-1xd7pro'
};

// Get the current domain and extract the base domain without www. and .com
const fullDomain = window.location.hostname;
// Remove 'www.' if present and extract the base domain without TLD
const domainParts = fullDomain.replace(/^www\./, '').split('.');
const baseDomain = domainParts.length >= 2 ? 
    (domainParts.length > 2 && domainParts[0].includes('highspeed') ? 
        domainParts[0] + '.' + domainParts[1] : domainParts[0]) : 
    fullDomain;

// Special case for go.frontier
const specialDomain = fullDomain.includes('go.frontier') ? 'go.frontier' : baseDomain;

// Get the appropriate CSS class for the current domain or use default
const buttonClass = domainClassMap[specialDomain] || 'css-1s55t5c';

// Get the zip code from localStorage or use default
let zipCode = '00000';

try {
    // Get user location from localStorage
    const userLocationStr = localStorage.getItem('user-location');

    if (userLocationStr) {
        // Parse the JSON string
        const userLocation = JSON.parse(userLocationStr);

        // Extract the zipCode if available
        if (userLocation && userLocation.zipCode) {
            zipCode = userLocation.zipCode;
        }
    }
} catch (error) {
    console.error('Error retrieving zip code from localStorage:', error);
}

// Find all HSI button divs with the gft-hsi-button class
const hsiButtons = document.querySelectorAll('.gft-hsi-button');

// HTML template for the replacement button
const buttonTemplate = `
        <a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0" 
           href="https://www.highspeedinternet.com/in-your-area?zip=${zipCode}&kbid=172539" 
           target="_blank" 
           rel="noopener noreferrer" 
           visibility="All devices">
            <button class="leshen-link-button convert-link-button ${buttonClass} ex50p320" 
                    color="primary" 
                    tabindex="0" 
                    type="button">
                <span class="button-text css-25jbay e1hk20aw0">Visit Highspeedinternet.com</span>
            </button>
        </a>
    `;

// Replace each button div with the template
hsiButtons.forEach(function (button) {
    // Create a temporary container for the HTML
    const temp = document.createElement('div');
    temp.innerHTML = buttonTemplate.trim();

    // Replace the button with the new content
    button.parentNode.replaceChild(temp.firstChild, button);
});