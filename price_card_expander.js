(function() {
    'use strict';
    
    // Configuration
    const config = {
        // Multiple potential selectors for pricing cards, will try each one
        potentialSelectors: [
            '.wrapper.default.css-1xl24yv.e7yna8n2',
            '.pricing-card',
            '.card',
            '[data-testid="pricing-card"]',
            '.plan-card',
            '.price-card',
            '.offer-card',
            // Common container classes that might contain pricing information
            '.pricing-container .card',
            '.pricing-section .card',
            '.pricing .card',
            // Generic card selectors with pricing-related content
            '.card:has(h3:contains("Plan"))',
            '.card:has(.price)',
            '.card:has(ul.bullets)'
        ],
        observerTimeout: 30000, // 30 seconds timeout for observer
        pollingInterval: 200, // Check every 200ms
        maxPollingAttempts: 300, // Maximum 60 seconds of polling
        debug: true // Enable debug mode
    };
    
    // Debug logging function
    function debug(message, ...args) {
        if (config.debug) {
            console.log(`[Price Card Expander] ${message}`, ...args);
        }
    }
    
    // Function to find the best selector that returns elements
    function findBestSelector() {
        debug('Searching for best selector');
        
        // Try each potential selector
        for (const selector of config.potentialSelectors) {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    debug(`Found ${elements.length} elements with selector: ${selector}`);
                    return { selector, elements: Array.from(elements) };
                }
            } catch (error) {
                debug(`Error with selector ${selector}:`, error.message);
            }
        }
        
        // If no specific selector works, try a more generic approach
        debug('No specific selector worked, trying generic approach');
        
        // Look for elements that might be cards with bullet lists
        const allElements = document.querySelectorAll('div');
        const potentialCards = Array.from(allElements).filter(el => {
            return el.querySelectorAll('ul.bullets, ul li').length > 0 && 
                   (el.textContent.toLowerCase().includes('plan') || 
                    el.textContent.toLowerCase().includes('price') || 
                    el.textContent.toLowerCase().includes('month') || 
                    el.textContent.toLowerCase().includes('$'));
        });
        
        if (potentialCards.length > 0) {
            debug(`Found ${potentialCards.length} potential cards using generic approach`);
            return { selector: 'generic', elements: potentialCards };
        }
        
        debug('No elements found with any selector');
        return { selector: null, elements: [] };
    }
    
    // Function to add toggle functionality to price cards
    function addToggleToPriceCards() {
        debug('Executing main functionality');
        
        const { selector, elements: cardElements } = findBestSelector();
        
        if (cardElements.length === 0) {
            console.warn('Price Card Expander: No price cards found with any selector');
            return;
        }
        
        debug(`Found ${cardElements.length} price cards using selector: ${selector}`);
        
        cardElements.forEach(card => {
            // Find the ul.bullets within this card
            const ulElements = card.querySelectorAll('ul.bullets');
            
            ulElements.forEach(ulElement => {
                // Check if a toggle div already exists to avoid adding it multiple times
                if (!ulElement.previousElementSibling || ulElement.previousElementSibling.textContent !== 'Plan Details') {
                    // Create the toggle div
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = 'Plan Details';
                    
                    // Style the toggle div
                    toggleDiv.style.textDecoration = 'underline';
                    toggleDiv.style.cursor = 'pointer'; // Indicate it's clickable
                    toggleDiv.style.marginTop = '10px'; // Add some spacing
                    toggleDiv.style.marginBottom = '10px'; // Add some spacing
                    toggleDiv.style.fontWeight = 'bold'; // Make it stand out
                    
                    // Insert the toggle div before the ul
                    ulElement.parentElement.insertBefore(toggleDiv, ulElement);
                    
                    // Collapse the ul by default
                    ulElement.style.display = 'none';
                    
                    // Add the click event listener to the toggle div
                    toggleDiv.addEventListener('click', () => {
                        if (ulElement.style.display === 'none') {
                            // Use the original display type if possible, or default to 'block'
                            const originalDisplay = ulElement.dataset.originalDisplay || 'block';
                            ulElement.style.display = originalDisplay;
                        } else {
                            // Store the current display before hiding
                            ulElement.dataset.originalDisplay = window.getComputedStyle(ulElement).display;
                            ulElement.style.display = 'none';
                        }
                    });
                } else {
                    // If a toggle div already exists, ensure the list is collapsed on page load
                    ulElement.style.display = 'none';
                }
            });
            
            console.log('Price Card Expander: Added toggle to card', card);
        });
    }
    
    // Method 1: MutationObserver approach
    function waitForElementWithObserver() {
        debug('Starting MutationObserver');
        
        return new Promise((resolve, reject) => {
            // Set timeout to avoid waiting indefinitely
            const timeoutId = setTimeout(() => {
                if (observer) {
                    observer.disconnect();
                }
                reject(new Error('MutationObserver timed out'));
            }, config.observerTimeout);
            
            // Check if any of our potential elements already exist
            const checkForElements = () => {
                for (const selector of config.potentialSelectors) {
                    try {
                        const elements = document.querySelectorAll(selector);
                        if (elements && elements.length > 0) {
                            debug(`Elements found with selector: ${selector}`);
                            return true;
                        }
                    } catch (error) {
                        // Ignore invalid selectors
                    }
                }
                
                // Check for generic card-like elements with bullet lists
                const allElements = document.querySelectorAll('div');
                const potentialCards = Array.from(allElements).filter(el => {
                    return el.querySelectorAll('ul.bullets, ul li').length > 0;
                });
                
                if (potentialCards.length > 0) {
                    debug(`Found ${potentialCards.length} potential cards using generic approach`);
                    return true;
                }
                
                return false;
            };
            
            // Check if element already exists
            if (checkForElements()) {
                clearTimeout(timeoutId);
                resolve();
                return;
            }
            
            // Set up observer
            const observer = new MutationObserver((mutations, obs) => {
                if (checkForElements()) {
                    clearTimeout(timeoutId);
                    obs.disconnect();
                    resolve();
                }
            });
            
            // Start observing
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    }
    
    // Method 2: Polling approach as fallback
    function waitForElementWithPolling() {
        debug('Starting polling fallback');
        
        return new Promise((resolve, reject) => {
            let attempts = 0;
            
            const checkInterval = setInterval(() => {
                attempts++;
                
                // Check if any of our potential elements exist
                const checkForElements = () => {
                    for (const selector of config.potentialSelectors) {
                        try {
                            const elements = document.querySelectorAll(selector);
                            if (elements && elements.length > 0) {
                                debug(`Elements found with selector: ${selector} after ${attempts} attempts`);
                                return true;
                            }
                        } catch (error) {
                            // Ignore invalid selectors
                        }
                    }
                    
                    // Check for generic card-like elements with bullet lists
                    const allElements = document.querySelectorAll('div');
                    const potentialCards = Array.from(allElements).filter(el => {
                        return el.querySelectorAll('ul.bullets, ul li').length > 0;
                    });
                    
                    if (potentialCards.length > 0) {
                        debug(`Found ${potentialCards.length} potential cards using generic approach after ${attempts} attempts`);
                        return true;
                    }
                    
                    return false;
                };
                
                if (checkForElements()) {
                    clearInterval(checkInterval);
                    resolve();
                    return;
                }
                
                if (attempts >= config.maxPollingAttempts) {
                    clearInterval(checkInterval);
                    reject(new Error('Polling timed out'));
                }
            }, config.pollingInterval);
        });
    }
    
    // Wait for the DOM to be ready
    function domReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    // Main execution
    async function init() {
        debug('Initializing');
        
        try {
            // Wait for DOM ready first
            await domReady();
            debug('DOM is ready');
            
            // Wait a bit for React to render components
            await new Promise(resolve => setTimeout(resolve, 1000));
            debug('Initial wait complete, checking for elements');
            
            // Try observer method first
            await waitForElementWithObserver().catch(async error => {
                debug(error.message);
                debug('Falling back to polling');
                
                // Fall back to polling if observer fails
                return waitForElementWithPolling();
            });
            
            // Execute main functionality once element is found
            addToggleToPriceCards();
            
        } catch (error) {
            console.error('Price Card Expander: Failed to find elements', error);
        }
    }
    
    // Start the script
    init();
})();