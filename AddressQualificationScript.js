(function() {
  'use strict';
  
  console.log('[Address Qualification] Script initialized');
  
  // Configuration
  const RADAR_PUBLISHABLE_KEY = 'prj_live_pk_d3a1113fc5c543c5fcd05f707d094fa5471b359d'; // Replace with your actual Radar key
  
  // Function to load Radar SDK
  function loadRadarSDK() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Radar) {
        console.log('[Address Qualification] Radar SDK already loaded');
        resolve();
        return;
      }
      
      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://js.radar.com/v4.5.3/radar.css';
      document.head.appendChild(cssLink);
      
      // Load JavaScript
      const script = document.createElement('script');
      script.src = 'https://js.radar.com/v4.5.3/radar.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('[Address Qualification] Radar SDK loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        console.error('[Address Qualification] Failed to load Radar SDK');
        reject(new Error('Failed to load Radar SDK'));
      };
      
      document.head.appendChild(script);
    });
  }
  
  // Function to prepare the container for Radar autocomplete
  function prepareAutocompleteContainer() {
    // Find the input group container
    const inputGroup = document.querySelector('.input-group.vwo_bl');
    
    if (!inputGroup) {
      console.log('[Address Qualification] Input group not found');
      return null;
    }
    
    console.log('[Address Qualification] Found input group, preparing for Radar autocomplete...');
    
    // Hide the original zip input
    const zipInput = inputGroup.querySelector('input[name="zip"][data-type="zip"]');
    if (zipInput) {
      zipInput.style.display = 'none';
    }
    
    // Create a container for Radar autocomplete
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.id = 'radar-autocomplete-container';
    autocompleteContainer.style.flex = '1';
    autocompleteContainer.style.minWidth = '0';
    
    // Insert the container before the submit button
    const submitButton = inputGroup.querySelector('button[type="submit"]');
    if (submitButton) {
      inputGroup.insertBefore(autocompleteContainer, submitButton);
      
      // Update button text if needed
      const buttonText = submitButton.textContent.trim();
      if (buttonText.toLowerCase() === 'search') {
        submitButton.textContent = 'Check Availability';
      }
    } else {
      inputGroup.appendChild(autocompleteContainer);
    }
    
    console.log('[Address Qualification] Container prepared successfully');
    return { container: autocompleteContainer, submitButton, inputGroup };
  }
  
  // Function to initialize Radar Autocomplete
  function initializeRadarAutocomplete(elements) {
    if (!window.Radar) {
      console.error('[Address Qualification] Radar SDK not loaded');
      return null;
    }
    
    console.log('[Address Qualification] Initializing Radar Autocomplete');
    
    // Initialize Radar
    Radar.initialize(RADAR_PUBLISHABLE_KEY);
    
    // Store selected address data
    let selectedAddressData = null;
    
    // Create Radar autocomplete widget
    const autocompleteWidget = Radar.ui.autocomplete({
      container: 'radar-autocomplete-container',
      responsive: true,
      placeholder: 'Enter your address',
      countryCode: 'US',
      layers: ['address'],
      limit: 8,
      minCharacters: 3,
      onSelection: (address) => {
        console.log('[Address Qualification] Address selected:', address);
        
        // Parse and store address data
        selectedAddressData = {
          formattedAddress: address.formattedAddress || address.addressLabel || '',
          street: address.addressLabel || (address.number ? `${address.number} ${address.street}` : address.street) || '',
          city: address.city || '',
          state: address.state || address.stateCode || '',
          zip: address.postalCode || '',
          country: address.country || address.countryCode || 'US',
          placeId: address.placeLabel || '',
          lat: address.latitude || address.geometry?.coordinates?.[1] || null,
          lng: address.longitude || address.geometry?.coordinates?.[0] || null
        };
        
        // Store in a data attribute on the container for later retrieval
        elements.container.dataset.selectedAddress = JSON.stringify(selectedAddressData);
        
        console.log('[Address Qualification] Address data stored:', selectedAddressData);
      },
      onError: (error) => {
        console.error('[Address Qualification] Radar error:', error);
      }
    });
    
    // Handle form submission
    if (elements.submitButton) {
      elements.submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleAddressSubmission(elements);
      });
    }
    
    console.log('[Address Qualification] Radar Autocomplete initialized successfully');
    return autocompleteWidget;
  }
  
  // Function to handle address submission
  function handleAddressSubmission(elements) {
    const addressData = elements.container.dataset.selectedAddress;
    
    if (!addressData) {
      console.log('[Address Qualification] No address selected');
      
      // Show error message
      const errorLabel = elements.inputGroup.querySelector('label.error');
      if (errorLabel) {
        errorLabel.textContent = 'Please select a valid address from the suggestions';
        errorLabel.classList.remove('hidden');
      }
      return;
    }
    
    try {
      const parsedAddress = JSON.parse(addressData);
      console.log('[Address Qualification] Submitting address:', parsedAddress);
      
      // Format address for URL parameter
      const formattedAddress = `${parsedAddress.street}, ${parsedAddress.city}, ${parsedAddress.state} ${parsedAddress.zip}`;
      
      // Create the URL with the address parameter
      const cartUrl = `/cart?address=${encodeURIComponent(formattedAddress)}`;
      
      console.log('[Address Qualification] Redirecting to:', cartUrl);
      
      // Redirect to the cart URL
      window.location.href = cartUrl;
      
    } catch (error) {
      console.error('[Address Qualification] Error parsing address data:', error);
    }
  }
  
  // Function to add custom styles
  function addCustomStyles() {
    const styleId = 'address-qualification-styles';
    
    // Check if styles already exist
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Radar Autocomplete container styling */
      #radar-autocomplete-container {
        position: relative;
      }
      
      /* Override Radar styles to match existing design */
      #radar-autocomplete-container .radar-autocomplete-input {
        width: 100% !important;
        padding: 12px !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        font-size: 16px !important;
        font-family: inherit !important;
      }
      
      #radar-autocomplete-container .radar-autocomplete-input:focus {
        outline: none !important;
        border-color: #0066cc !important;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.25) !important;
      }
      
      /* Dropdown styling */
      #radar-autocomplete-container .radar-autocomplete-results {
        z-index: 10000 !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
        border-radius: 4px !important;
      }
      
      /* Error label styling */
      label.error {
        color: #d32f2f;
        font-size: 14px;
        margin-top: 5px;
      }
      
      label.error.hidden {
        display: none;
      }
      
      /* Ensure proper flex layout */
      .input-group.vwo_bl {
        display: flex !important;
        gap: 10px !important;
        align-items: flex-start !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('[Address Qualification] Custom styles added');
  }
  
  // Main initialization function
  async function initialize() {
    try {
      console.log('[Address Qualification] Starting initialization');
      
      // Add custom styles
      addCustomStyles();
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Prepare the container
      const elements = prepareAutocompleteContainer();
      
      if (!elements) {
        console.error('[Address Qualification] Could not prepare autocomplete container');
        return;
      }
      
      // Load Radar SDK
      await loadRadarSDK();
      
      // Initialize Radar autocomplete
      initializeRadarAutocomplete(elements);
      
      console.log('[Address Qualification] Initialization complete');
      
    } catch (error) {
      console.error('[Address Qualification] Initialization error:', error);
    }
  }
  
  // Start initialization
  initialize();
  
})();
