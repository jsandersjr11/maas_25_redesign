/**
 * HSI Button Replacement Script (Console Version)
 * This script replaces the HSI button div with an anchor link
 * and pulls the zip code from localStorage to insert in the href.
 * This version can be run directly in the console.
 */
(function() {
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
        console.log('Found zip code:', zipCode);
    } catch (error) {
        console.error('Error retrieving zip code from localStorage:', error);
    }
    
    // Find all HSI button divs with the gft-hsi-button class
    const hsiButtons = document.querySelectorAll('.gft-hsi-button');
    console.log('Found button elements:', hsiButtons.length);
    
    if (hsiButtons.length === 0) {
        console.warn('No elements found with class .gft-hsi-button');
        // Try to find elements by other potential selectors
        const alternativeSelectors = ['.hsi-button', '[class*="hsi"]', '[class*="button"]'];
        alternativeSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} elements with selector: ${selector}`);
            }
        });
    }
    
    // HTML template for the replacement button
    const buttonTemplate = `
        <a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0" 
           href="https://www.highspeedinternet.com/in-your-area?zip=${zipCode}&kbid=172539" 
           target="_blank" 
           rel="noopener noreferrer" 
           visibility="All devices">
            <button class="leshen-link-button convert-link-button css-hnohsy ex50p320" 
                    color="primary" 
                    tabindex="0" 
                    type="button">
                <span class="button-text css-25jbay e1hk20aw0">Visit Highspeedinternet.com</span>
            </button>
        </a>
    `;
    
    // Replace each button div with the template
    hsiButtons.forEach(function(button) {
        try {
            // Create a temporary container for the HTML
            const temp = document.createElement('div');
            temp.innerHTML = buttonTemplate.trim();
            
            // Replace the button with the new content
            button.parentNode.replaceChild(temp.firstChild, button);
            console.log('Successfully replaced button element');
        } catch (error) {
            console.error('Error replacing button:', error);
        }
    });
    
    return `Replacement script executed. Found ${hsiButtons.length} button elements.`;
})();
