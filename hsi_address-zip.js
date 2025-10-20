/**
 * HSI Address/ZIP Form Injector
 * Injects a ZIP code search form after the .geo-hero element
 * and tracks form interactions with custom events
 */

/**
 * Main injection function - adds ZIP form to the page
 */
function injectZipForm() {
  const geoHero = document.querySelector('.geo-hero');
  
  if (!geoHero) {
    console.warn('Target element .geo-hero not found');
    return;
  }

  // Create the form HTML
  const formHTML = `
    <div class="columns small-12 large-8" style="justify-content:center" data-injected-zip-form="true">
      <div class="wpb_text_column wpb_content_element vc_custom_1741211791188">
        <div class="wpb_wrapper"></div>
      </div>
      <div class="wpb_text_column wpb_content_element">
        <div class="wpb_wrapper">
          <p class="font-small no-margin-bottom small-padding">Enter your ZIP for more accurate results.</p>
        </div>
      </div>
      <div class="wpb_text_column wpb_content_element">
        <div class="wpb_wrapper">
          <form class="zip-finder" method="post" accept-charset="UTF-8">
            <input type="text" size="5" tabindex="-1" readonly="" style="position:fixed;-webkit-appearance:none;box-shadow:none;border:none;background:none;cursor:default;z-index:-1;width: 1px;height:1px;">
            <input type="hidden" name="tab" value="">
            <input type="hidden" name="redirect" value="sb-3">
            <div class="input-group">
              <span data-tooltip="wv2vtm-tooltip" title="" data-tooltip-class="tooltip" class="find-zip__tooltip hidden has-tip" aria-describedby="1kuqcm-tooltip" data-yeti-box="1kuqcm-tooltip" data-toggle="1kuqcm-tooltip" data-resize="1kuqcm-tooltip" style="display: inline;" data-events="resize">
                <button type="button" class="find-zip" style="display: none !important;">
                  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm17.88 6c-.92-8.34-7.54-14.96-15.88-15.88v-4.12h-4v4.12c-8.34.92-14.96 7.54-15.88 15.88h-4.12v4h4.12c.92 8.34 7.54 14.96 15.88 15.88v4.12h4v-4.12c8.34-.92 14.96-7.54 15.88-15.88h4.12v-4h-4.12zm-17.88 16c-7.73 0-14-6.27-14-14s6.27-14 14-14 14 6.27 14 14-6.27 14-14 14z"></path>
                  </svg>
                </button>
              </span>
              <input type="tel" name="zip" data-type="zip" id="plansHero" placeholder="Zip code" maxlength="5" minlength="5" required="">
              <button type="submit" class="button square" data-component="body">Search</button>
              <label class="error hidden" for="plansHero"></label>
            </div>
          </form>
          <p></p>
        </div>
      </div>
    </div>
  `;

  // Insert the form after .geo-hero
  geoHero.insertAdjacentHTML('afterend', formHTML);

  // Hide the original geo-hero__zip if it exists
  const geoHeroZip = document.querySelector('.geo-hero__zip');
  if (geoHeroZip) {
    geoHeroZip.style.display = 'none';
  }

  console.log('ZIP form injected successfully');
}

/**
 * Sends a custom event for tracking
 * @param {string} eventName - Name of the event to track
 */
function sendCustomEvent(eventName) {
  // Create and dispatch a custom event
  const event = new CustomEvent(eventName, {
    bubbles: true,
    detail: { timestamp: new Date().toISOString() }
  });
  document.dispatchEvent(event);

  // Also log to console for debugging
  console.log(`Custom event fired: ${eventName}`);

  // If you have analytics integration (Google Analytics, etc.), add it here
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Initialize form interaction tracking
 */
function initFormTracking() {
  let fired = false;

  const inputsSelector = [
    // ZIP form
    '#main-content > div:nth-child(2) > div > div > div > div > div.columns.small-12.large-8.vwo_bl > div:nth-child(3) > div > form input',
    '#main-content > div:nth-child(2) > div > div > div > div > div.columns.small-12.large-8.vwo_bl > div:nth-child(3) > div > form textarea',
    // ADDRESS form
    '#main-content > div:nth-child(2) > div > div > div > div > div.columns.small-12.large-8 > div:nth-child(3) > div > form input',
    '#main-content > div:nth-child(2) > div > div > div > div > div.columns.small-12.large-8 > div:nth-child(3) > div > form textarea',
    // Injected form
    '[data-injected-zip-form="true"] input[type="tel"]',
    '[data-injected-zip-form="true"] textarea'
  ].join(', ');

  function matches(el, sel) {
    if (!el) return false;
    const fn = el.matches || el.webkitMatchesSelector || el.msMatchesSelector;
    return fn ? fn.call(el, sel) : false;
  }

  function triggerOnce() {
    if (fired) return;
    fired = true;
    sendCustomEvent('form_start_zip_or_address');
    document.removeEventListener('input', onInput, true);
  }

  function onInput(e) {
    if (matches(e.target, inputsSelector)) {
      triggerOnce();
    }
  }

  // Track first input event
  document.addEventListener('input', onInput, true);

  console.log('Form tracking initialized');
}

/**
 * Initialize everything when DOM is ready
 */
function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectZipForm();
      initFormTracking();
    });
  } else {
    injectZipForm();
    initFormTracking();
  }
}

// Auto-initialize if this script is loaded directly
// Comment out this line if you want manual control
// init();

// Export functions for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { injectZipForm, initFormTracking, sendCustomEvent, init };
}
