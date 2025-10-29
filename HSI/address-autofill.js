// <div id="location-widget"></div>

(function () {
    'use strict';

    // Find the location-widget element
    const locationWidget = document.getElementById('location-widget');

    if (!locationWidget) {
        console.error('Element with id "location-widget" not found');
        return;
    }

    // Create the HTML content
    const htmlContent = `
        <div class="columns small-12 margin-bottom">
            <div class="wpb_text_column wpb_content_element vwo_bl"> <div class="wpb_wrapper vwo_bl"> <p class="font-small no-margin-bottom small-padding vwo_bl">Enter your address below to find providers in the area.</p> </div> </div>
                        
            <form id="addressForm" class="zip-finder address-finder" method="post" accept-charset="UTF-8">
                <input type="text" size="5" tabindex="-1" readonly="" style="position:fixed;-webkit-appearance:none;box-shadow:none;border:none;background:none;cursor:default;z-index:-1;width: 1px;height:1px;">
                <input type="hidden" name="tab" value="">
                <input type="hidden" name="redirect" value="sb-3">
                <input type="hidden" name="zip" id="selectedZip" data-type="zip" value="">
                
                <label for="heroAddress" class="color-white show-for-sr">Search Providers near you</label>
                <div class="input-group address-input-wrapper">
                    <input type="text" data-type="address" id="heroAddress" style="border-radius: 0; height: 46px;" placeholder="Address" required="">
                    <button type="submit" class="button square large" data-component="hero">Search</button>
                    <label class="error hidden" for="heroAddress"></label>
                </div>
            </form>
            <style>
                .radar-autocomplete-input {
                border: none;
                border-radius: 0;
                padding-top: 12px;
                padding-bottom: 12px; }
                .radar-autocomplete-search-icon {
                top: 18px;}   
                .address-input-wrapper {
                    display: flex;
                }   
                #heroAddressAutocomplete {
                    flex-grow: 1;
                }

                .address-finder {
                    width: 100% !important;
                }
                
                @media (max-width: 768px) {
                    .input-group {
                        display: inline-flex;
                        flex-direction: column;
                        width: 100% !important; }
                    .radar-autocomplete-wrapper {
                        width: 100% !important;
                    }
                }
            </style>
        </div>
    `;

    // Function to load external CSS
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            // Check if CSS is already loaded
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Function to load external JavaScript
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Function to setup address autocomplete
    function setupAutocomplete() {
        const addressInput = document.getElementById('heroAddress');

        if (!addressInput) {
            console.error('Address input not found');
            return;
        }

        // Initialize Radar SDK (replace with your actual publishable key)
        if (typeof Radar === 'undefined') {
            console.error('Radar SDK not loaded');
            return;
        }

        // Initialize Radar with your publishable key
        Radar.initialize('prj_live_pk_d3a1113fc5c543c5fcd05f707d094fa5471b359d');

        // Create a wrapper div for the autocomplete
        const autocompleteWrapper = document.createElement('div');
        autocompleteWrapper.id = 'heroAddressAutocomplete';

        // Replace the input with the autocomplete wrapper
        addressInput.parentNode.insertBefore(autocompleteWrapper, addressInput);
        addressInput.remove();

        // Create autocomplete input
        Radar.ui.autocomplete({
            container: 'heroAddressAutocomplete',
            showMarkers: false,
            responsive: true,
            width: '100%',
            placeholder: 'Address',
            limit: 8,
            minCharacters: 3,
            near: null, // omit near to use default IP address location
            onSelection: (address) => {
                console.log('Selected address:', address);
                
                // Store the selected address data for form submission
                window.selectedAddress = address;
                
                // Extract and save street address to localStorage
                if (address && address.addressLabel) {
                    localStorage.setItem('streetAddress', address.addressLabel);
                    console.log('Street address saved to localStorage:', address.addressLabel);
                }
                
                // Extract zip code and populate hidden input
                if (address && address.postalCode) {
                    const zipInput = document.getElementById('selectedZip');
                    if (zipInput) {
                        zipInput.value = address.postalCode;
                        console.log('Zip code extracted and set:', address.postalCode);
                    }
                } else {
                    console.warn('No postal code found in selected address');
                }
            },
        });
    }


    // Load Radar dependencies and insert HTML
    async function initialize() {
        try {
            // Load Radar CSS
            await loadCSS('https://js.radar.com/v4.5.3/radar.css');
            console.log('Radar CSS loaded successfully');

            // Load Radar JS
            await loadScript('https://js.radar.com/v4.5.3/radar.min.js');
            console.log('Radar JS loaded successfully');

            // Insert the HTML content
            locationWidget.innerHTML = htmlContent;
            console.log('Location widget content inserted successfully');

            // Setup address autocomplete
            setupAutocomplete();
            
            // Setup form submission handler
            setupFormHandler();

        } catch (error) {
            console.error('Error loading Radar dependencies:', error);
        }
    }
    
    // Function to handle form submission validation
    function setupFormHandler() {
        const form = document.getElementById('addressForm');
        if (form) {
            // Pre-submit validation to ensure zip code was extracted
            form.addEventListener('submit', function(e) {
                const zipInput = document.getElementById('selectedZip');
                const errorLabel = document.querySelector('.error');
                
                // Validate that zip code was extracted from the address
                if (!zipInput.value || zipInput.value.length !== 5) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Stop the site's .zip-finder handler
                    if (errorLabel) {
                        errorLabel.textContent = 'Please select a valid address with a ZIP code';
                        errorLabel.classList.remove('hidden');
                    }
                    return false;
                }
                
                // Hide error - the site's existing .zip-finder handler will take over
                if (errorLabel) {
                    errorLabel.classList.add('hidden');
                }
                
                console.log('ZIP validated:', zipInput.value);
                console.log('Street address saved:', localStorage.getItem('streetAddress'));
                // The site's .zip-finder handler will now handle the AJAX validation and redirect
            }, true); // Use capture phase to run before the site's handler
        }
    }

    // Initialize the widget
    initialize();

})();
