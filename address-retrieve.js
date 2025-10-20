/**
 * Address Retrieval Script
 * This script retrieves the saved address from localStorage and populates it into the page
 */

(function() {
    'use strict';

    // Function to populate address into the page
    function populateAddressFromStorage() {
        try {
            // Get the saved address from localStorage
            const savedAddress = localStorage.getItem('selectedAddress');
            
            if (!savedAddress) {
                console.log('No saved address found in localStorage');
                return;
            }

            // Parse the address object
            const address = JSON.parse(savedAddress);
            
            // Get the street address (without city, state, zip)
            let streetAddress = '';
            
            // Try different properties that might contain the street address
            if (address.addressLabel) {
                streetAddress = address.addressLabel;
            } else if (address.street) {
                streetAddress = address.street;
            } else if (address.formattedAddress) {
                // Extract just the street from formatted address (first line before comma)
                streetAddress = address.formattedAddress.split(',')[0].trim();
            }

            if (!streetAddress) {
                console.warn('No street address found in saved address object');
                return;
            }

            console.log('Street address to populate:', streetAddress);

            // Try multiple selectors to find the target element
            const selectors = [
                'small strong',
                'small > strong',
                'small :nth-child(2)'
            ];

            let elementFound = false;

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                
                if (elements.length > 0) {
                    elements.forEach((element, index) => {
                        element.textContent = streetAddress;
                        console.log(`Address populated into element (${selector}) [${index}]:`, element);
                        elementFound = true;
                    });
                }
            }

            if (!elementFound) {
                console.warn('No matching elements found for any selector');
            } else {
                console.log('Address successfully populated!');
            }

        } catch (error) {
            console.error('Error populating address from localStorage:', error);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populateAddressFromStorage);
    } else {
        populateAddressFromStorage();
    }

})();
