(function () {
  console.log('[GFT Cart Button Finder] Script initialized');

  // Initialize when DOM is ready to support VWO head injection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMainScript);
  } else {
    initializeMainScript();
  }

  function initializeMainScript() {
    console.log('[GFT Cart Button Finder] Initializing main script');

    // Build URL
    const buyflowUrl = 'https://clearlink.go2cloud.org/aff_c?offer_id=3961&aff_id=1024';

    // Process inside <main> > first <section> > .content per scenarios
    function processScopedLinks(url) {
      const heroEl = document.querySelector('.leshen-hero');
      if (!heroEl) {
        console.log('[GFT Cart Button Finder] .leshen-hero not found');
        return;
      }
      const content = heroEl.querySelector(".content");
      if (!content) {
        console.log("[GFT Cart Button Finder] .content not found inside .leshen-hero");
        return;
      }

      // If we find an <input>, do nothing
      if (content.querySelector('input')) {
        console.log('[GFT Cart Button Finder] <input> found in scope; skipping');
        return;
      }

      const telAnchor = content.querySelector('a[href^="tel:"]');
      const cartAnchor = content.querySelector('a[href*="/ftr-buy"]');

      // If both exist: update only the /ftr-buy link
      if (telAnchor && cartAnchor) {
        try {
          cartAnchor.href = url;
          cartAnchor.dataset.GFTUpdated = '1';
          console.log('[GFT Cart Button Finder] Updated existing /ftr-buy link in scope');
        } catch (e) {
          console.error('[GFT Cart Button Finder] Failed updating /ftr-buy link', e);
        }
        return;
      }

      // If only tel exists: append the button anchor like in GFT_Global_4_Responsive_Button.js
      if (telAnchor && !cartAnchor) {
        // Avoid duplicating if already injected
        if (content.querySelector('a.leshen-link-button-wrapper[data-GFT-injected="1"]')) {
          console.log('[GFT Cart Button Finder] Button already injected; skipping');
          return;
        }

        // Apply button styling to the button inside the telephone link
        try {
          const telButton = telAnchor.querySelector('button');
          if (telButton) {
            telButton.style.cssText = `
               padding-top: 8px !important;
               padding-bottom: 8px !important;
               padding-left: 16px !important;
               padding-right: 16px !important;
               box-shadow: none !important;
               margin-top: 1.5rem !important;
               position: relative !important;
               z-index: 9999 !important;
               pointer-events: auto !important;
               display: block !important;
               visibility: visible !important;
               opacity: 1 !important;
               border: 2px solid #404040 !important;
               color: #404040 !important;
               background: #fff !important;
               border-radius: 2em !important;
               cursor: pointer !important;
             `;
            console.log('[GFT Cart Button Finder] Applied button styling to button inside tel: link');
          } else {
            console.log('[GFT Cart Button Finder] No button found inside tel: link');
          }
        } catch (e) {
          console.error('[GFT Cart Button Finder] Failed to apply styling to button inside tel: link', e);
        }

        // Add a unique ID to make it easier to find and re-inject if removed
        const buttonId = 'GFT-injected-button-' + Math.floor(Math.random() * 10000);

        // Create a more resilient button that's harder to remove
        const newButtonHtml = `
         <a id="${buttonId}" class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 GFT-cart-link" href="${url}" data-GFT-injected="1" visibility="All devices" style="
             display: block !important;
             visibility: visible !important;
             opacity: 1 !important;
         ">
             <button class="leshen-link-button convert-link-button css-4o5p4y" color="dark" tabindex="0" type="button" style="
                 display: -webkit-box !important;
                 display: -webkit-flex !important;
                 display: -ms-flexbox !important;
                 display: flex !important;
                 -webkit-align-items: center !important;
                 -webkit-box-align: center !important;
                 -ms-flex-align: center !important;
                 align-items: center !important;
                 -webkit-box-pack: center !important;
                 -ms-flex-pack: center !important;
                 -webkit-justify-content: center !important;
                 justify-content: center !important;
                 padding: 8px 16px !important;
                 font: inherit !important;
                 color: #000 !important;
                 background-color: #FFC800 !important;
                 border: 0 !important;
                 border-radius: 2em !important;
                 cursor: pointer !important;
                 -webkit-transition: all 0.3s !important;
                 transition: all 0.3s !important;
                 -webkit-appearance: button !important;
                 box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.1) !important;
                 margin-top: 1.5rem !important;
                 position: relative !important;
                 z-index: 9999 !important;
                 pointer-events: auto !important;
                 visibility: visible !important;
                 opacity: 1 !important;
             ">
                 <span class="button-text css-2qtueq e1hk20aw0" style="
                     font-weight: 500;
                     font-size: calc(0.5555555555555556vw + 0.5rem);
                     line-height: calc(1.1111111111111112vw + 0.75rem);
                     pointer-events: auto !important;
                     display: inline !important;
                     visibility: visible !important;
                     opacity: 1 !important;
                 ">Order Now</span>
             </button>
         </a>`;

        try {
          // Try multiple insertion methods to ensure the button gets added
          try {
            // Method 1: Standard insertion
            telAnchor.insertAdjacentHTML('beforebegin', newButtonHtml);
            console.log('[GFT Cart Button Finder] Injected buyflow button before tel: link');
          } catch (innerError) {
            console.warn('[GFT Cart Button Finder] Primary insertion method failed, trying alternative', innerError);

            // Method 2: Create element and append
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newButtonHtml;
            const buttonElement = tempDiv.firstElementChild;
            telAnchor.parentNode.insertBefore(buttonElement, telAnchor);
            console.log('[GFT Cart Button Finder] Injected buyflow button using alternative method');
          }

          // Add protection against DOM manipulation
          protectInjectedElements();
        } catch (e) {
          console.error('[GFT Cart Button Finder] All insertion methods failed', e);

          // Last resort: Try to insert at the end of the section
          try {
            const parentSection = content.closest('section');
            if (parentSection) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = newButtonHtml;
              const buttonElement = tempDiv.firstElementChild;
              parentSection.appendChild(buttonElement);
              console.log('[GFT Cart Button Finder] Injected buyflow button at end of section as last resort');
              protectInjectedElements();
            }
          } catch (lastError) {
            console.error('[GFT Cart Button Finder] Even last resort insertion failed', lastError);
          }
        }
        return;
      }

      // If only /ftr-buy exists (no tel): update it
      if (!telAnchor && cartAnchor) {
        try {
          cartAnchor.href = url;
          cartAnchor.dataset.GFTUpdated = '1';
          console.log('[GFT Cart Button Finder] Updated /ftr-buy link (no tel present)');
        } catch (e) {
          console.error('[GFT Cart Button Finder] Failed updating /ftr-buy link (no tel)', e);
        }
      }
    }

    // Process all cart links on the entire page
    function processAllCartLinks(url) {
      console.log('[GFT Cart Button Finder] Searching for all cart links on the page');
      // Updated selector to catch links containing "/ftr-buy"
      const allCartLinks = document.querySelectorAll('a[href*="/ftr-buy"]');

      if (allCartLinks.length === 0) {
        console.log('[GFT Cart Button Finder] No cart links found on the page');
        return;
      }

      console.log(`[GFT Cart Button Finder] Found ${allCartLinks.length} cart links on the page`);

      allCartLinks.forEach((link, index) => {
        try {
          // Skip links that were already processed by processScopedLinks
          if (link.dataset.GFTUpdated === '1') {
            console.log(`[GFT Cart Button Finder] Skipping already updated cart link #${index + 1}`);
            return;
          }

          link.href = url;
          link.dataset.GFTUpdated = '1';
          console.log(`[GFT Cart Button Finder] Updated cart link #${index + 1}`);
        } catch (e) {
          console.error(`[GFT Cart Button Finder] Failed updating cart link #${index + 1}`, e);
        }
      });
    }

    // Add a global verification flag to track successful URL modifications
    window.GFTCartButtonFinderSuccess = false;

    processScopedLinks(buyflowUrl);
    processAllCartLinks(buyflowUrl);

    // Check if initial application was successful
    const initialInjectedElements = document.querySelectorAll('[data-GFT-injected="1"]');
    const initialUpdatedElements = document.querySelectorAll('[data-GFT-updated="1"]');

    if (initialInjectedElements.length > 0 || initialUpdatedElements.length > 0) {
      console.log('[GFT Cart Button Finder] Initial URL modifications successful');
      window.GFTCartButtonFinderSuccess = true;
    }

    // Set up a MutationObserver to detect when our buttons might be removed
    setupMutationObserver(buyflowUrl);

    // Also set up delayed re-injection to handle cases where site scripts remove our elements
    // after initial injection but before MutationObserver is set up
    scheduleReinjection(buyflowUrl);

    // Schedule multiple re-injections at increasing intervals
    function scheduleReinjection(url) {
      // Initial delays for quick checks
      const initialDelays = [500, 1000, 2000, 3000, 5000];

      // Add longer-term periodic checks
      const longTermDelays = [];
      for (let i = 10; i <= 60; i += 10) {
        longTermDelays.push(i * 1000); // 10s, 20s, 30s, etc. up to 60s
      }

      const allDelays = [...initialDelays, ...longTermDelays];

      // Schedule all the checks
      allDelays.forEach(delay => {
        setTimeout(() => {
          console.log(`[GFT Cart Button Finder] Scheduled re-injection check after ${delay}ms`);

          // If we've already verified success and elements are still present, don't reapply
          if (window.GFTCartButtonFinderSuccess) {
            const currentElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');
            if (currentElements.length > 0) {
              console.log('[GFT Cart Button Finder] URL modifications already verified successful, skipping re-injection');
              return;
            }
          }

          const injectedElements = document.querySelectorAll('[data-GFT-injected="1"]');
          const updatedElements = document.querySelectorAll('[data-GFT-updated="1"]');
          const alreadyUpdatedLinks = document.querySelectorAll('a[href*="offer_id=3961"]');

          if (injectedElements.length === 0 && updatedElements.length === 0 && alreadyUpdatedLinks.length === 0) {
            console.log('[GFT Cart Button Finder] Scheduled re-injection: Missing elements detected, re-applying');
            processScopedLinks(url);
            processAllCartLinks(url);

            // Check if this re-injection was successful
            setTimeout(() => {
              const newElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');
              if (newElements.length > 0) {
                console.log('[GFT Cart Button Finder] Re-injection successful, marking as verified');
                window.GFTCartButtonFinderSuccess = true;
              }
            }, 100);
          }
        }, delay);
      });

      // Also set up a continuous check that runs every 5 seconds for 10 minutes
      let checkCount = 0;
      const maxChecks = 120; // 10 minutes (120 * 5s = 600s = 10min)

      const intervalId = setInterval(() => {
        if (checkCount >= maxChecks) {
          clearInterval(intervalId);
          console.log('[GFT Cart Button Finder] Ending continuous checks after 5 minutes');
          return;
        }

        checkCount++;

        // If we've already verified success and elements are still present, don't reapply
        if (window.GFTCartButtonFinderSuccess) {
          const currentElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');
          if (currentElements.length > 0) {
            console.log('[GFT Cart Button Finder] Continuous check: URL modifications already verified successful, skipping');
            return;
          }
        }

        const injectedElements = document.querySelectorAll('[data-GFT-injected="1"]');
        const updatedElements = document.querySelectorAll('[data-GFT-updated="1"]');
        const alreadyUpdatedLinks = document.querySelectorAll('a[href*="offer_id=3961"]');

        if (injectedElements.length === 0 && updatedElements.length === 0 && alreadyUpdatedLinks.length === 0) {
          console.log('[GFT Cart Button Finder] Continuous check: Missing elements detected, re-applying');
          processScopedLinks(url);
          processAllCartLinks(url);

          // Check if this re-injection was successful
          setTimeout(() => {
            const newElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');
            if (newElements.length > 0) {
              console.log('[GFT Cart Button Finder] Continuous check re-injection successful, marking as verified');
              window.GFTCartButtonFinderSuccess = true;
            }
          }, 100);
        }

      }, 5000); // Check every 5 seconds
    }

    // Function to protect injected elements from removal
    function protectInjectedElements() {
      const injectedElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');

      injectedElements.forEach(element => {
        // Make it harder to remove the element
        const originalRemove = element.remove;
        element.remove = function () {
          console.log('[GFT Cart Button Finder] Prevented removal of injected element');
          return false;
        };

        // Prevent style changes that would hide the element
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function (name, value) {
          if (name === 'style' && (value.includes('display: none') || value.includes('visibility: hidden') || value.includes('opacity: 0'))) {
            console.log('[GFT Cart Button Finder] Prevented style attribute change that would hide element');
            return false;
          }
          return originalSetAttribute.call(this, name, value);
        };

        // Prevent class changes that might hide the element
        const originalClassListAdd = element.classList.add;
        element.classList.add = function (className) {
          if (className.includes('hidden') || className.includes('invisible') || className.includes('removed')) {
            console.log('[GFT Cart Button Finder] Prevented adding class that might hide element:', className);
            return false;
          }
          return originalClassListAdd.call(this, className);
        };
      });
    }

    // Function to set up mutation observer to detect when our buttons are removed
    function setupMutationObserver(url) {
      console.log('[GFT Cart Button Finder] Setting up MutationObserver to monitor button removal');

      // Create an observer instance
      const observer = new MutationObserver((mutations) => {
        let needToReapply = false;

        mutations.forEach((mutation) => {
          // Check if nodes were removed
          if (mutation.removedNodes.length > 0) {
            // Check if any of our injected/updated elements were removed
            for (let i = 0; i < mutation.removedNodes.length; i++) {
              const node = mutation.removedNodes[i];

              // Check if the node is an element and has our data attribute or contains elements with our attribute
              if (node.nodeType === 1) { // ELEMENT_NODE
                if (node.dataset && node.dataset.GFTInjected === '1' || node.dataset && node.dataset.GFTUpdated === '1') {
                  console.log('[GFT Cart Button Finder] Detected removal of our injected/updated element');
                  needToReapply = true;
                  break;
                }

                // Also check if any of the removed node's children had our data attribute
                if (node.querySelector && node.querySelector('[data-GFT-injected="1"], [data-GFT-updated="1"]')) {
                  console.log('[GFT Cart Button Finder] Detected removal of a container with our injected/updated elements');
                  needToReapply = true;
                  break;
                }
              }
            }
          }
        });

        // If our elements were removed, reapply them only if not already verified successful
        if (needToReapply) {
          // Check if we've already verified success
          if (window.GFTCartButtonFinderSuccess) {
            console.log('[GFT Cart Button Finder] Elements removed but URL modifications already verified successful, skipping re-application');
          } else {
            console.log('[GFT Cart Button Finder] Re-applying button modifications after detected removal');
            setTimeout(() => {
              processScopedLinks(url);
              processAllCartLinks(url);

              // Check if this re-injection was successful
              setTimeout(() => {
                const newElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');
                if (newElements.length > 0) {
                  console.log('[GFT Cart Button Finder] MutationObserver re-injection successful, marking as verified');
                  window.GFTCartButtonFinderSuccess = true;
                }
              }, 100);
            }, 100); // Small delay to ensure DOM is settled
          }
        }
      });

      // Start observing the document body for changes
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[GFT Cart Button Finder] MutationObserver started');
      } else {
        console.warn('[GFT Cart Button Finder] document.body not found, MutationObserver not started');
      }

      // Also set up a periodic check as a fallback
      setInterval(() => {
        // If we've already verified success, skip the check
        if (window.GFTCartButtonFinderSuccess) {
          return;
        }

        const injectedElements = document.querySelectorAll('[data-GFT-injected="1"]');
        const updatedElements = document.querySelectorAll('[data-GFT-updated="1"]');
        const alreadyUpdatedLinks = document.querySelectorAll('a[href*="offer_id=3961"]');

        // If we expected elements to be there but they're not, reapply
        if (injectedElements.length === 0 && updatedElements.length === 0 && alreadyUpdatedLinks.length === 0) {
          console.log('[GFT Cart Button Finder] Periodic check: No injected/updated elements found, re-applying');
          processScopedLinks(url);
          processAllCartLinks(url);

          // Check if this re-injection was successful
          setTimeout(() => {
            const newElements = document.querySelectorAll('[data-GFT-injected="1"], [data-GFT-updated="1"]');
            if (newElements.length > 0) {
              console.log('[GFT Cart Button Finder] Periodic check re-injection successful, marking as verified');
              window.GFTCartButtonFinderSuccess = true;
            }
          }, 100);
        }
      }, 2000); // Check every 2 seconds
    }

    console.log('[GFT Cart Button Finder] Main script execution completed');
  }

  // Script initialization occurs via event listener/localStorage
})();