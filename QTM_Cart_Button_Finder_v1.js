(function () {
    console.log('[QTM Cart Button Finder] Script initialized');
 
    // Fallback init in case event never fires
    let scriptInitialized = false;
    const fallbackTimeout = setTimeout(() => {
      if (!scriptInitialized) {
        console.log('[QTM Cart Button Finder] Fallback timeout reached. Initializing script anyway.');
        initializeMainScript();
      }
    }, 30000);
 
    // Listen for the mapiRequestIdReady event
    document.addEventListener('mapiRequestIdReady', (e) => {
      console.log('[QTM Cart Button Finder] mapiRequestIdReady event received');
      const requestId = e?.detail?.requestId;
      console.log('[QTM Cart Button Finder] Request ID from event:', requestId);
 
      if (requestId && !scriptInitialized) {
        scriptInitialized = true;
        clearTimeout(fallbackTimeout);
 
        try {
          const mapiData = localStorage.getItem('mapi');
          if (mapiData) {
            const parsedData = JSON.parse(mapiData);
            console.log('[QTM Cart Button Finder] MAPI data found in localStorage');
            initializeMainScript(parsedData, requestId);
          } else {
            console.log('[QTM Cart Button Finder] No MAPI data in localStorage, using event data only');
            const minimalData = { requestId };
            initializeMainScript(minimalData, requestId);
          }
        } catch (error) {
          console.error('[QTM Cart Button Finder] Error processing MAPI data:', error);
          const minimalData = { requestId };
          initializeMainScript(minimalData, requestId);
        }
      } else if (!requestId) {
        console.log('[QTM Cart Button Finder] Event received but no requestId found in event details');
      }
    });
 
    // Also check localStorage immediately in case the event has already fired
    try {
      const mapiData = localStorage.getItem('mapi');
      if (mapiData && !scriptInitialized) {
        const parsedData = JSON.parse(mapiData);
        if (
          parsedData &&
          (parsedData.requestId ||
            (parsedData.requestData && parsedData.requestData.requestId) ||
            (parsedData.requestData &&
              parsedData.requestData.fullResponse &&
              parsedData.requestData.fullResponse.data &&
              parsedData.requestData.fullResponse.data.request_id))
        ) {
          console.log('[QTM Cart Button Finder] MAPI data already exists in localStorage with requestId');
          scriptInitialized = true;
          clearTimeout(fallbackTimeout);
          initializeMainScript(parsedData);
        }
      }
    } catch (error) {
      console.error('[QTM Cart Button Finder] Error checking initial localStorage:', error);
    }
 
    function initializeMainScript(parsedMapiData = null, eventRequestId = null) {
      console.log('[QTM Cart Button Finder] Initializing main script');
 
      // Define the promo code to sales code mapping (updated from CSV data)
      const promoToSalesCodeMap = {
        "173948": "8009444",
        "173949": "8009444",
        "173839": "8009444",
        "173840": "8009444",
        "173964": "8009444",
        "173965": "8009444",
        "173913": "8011808",
        "173914": "8011808",
        "173923": "8011809",
        "173924": "8011809",
        "173967": "8011809",
        "173969": "8011809",
        "173946": "8009444",
        "173947": "8009444",
        "173984": "8009444",
        "173985": "8009444",
        "174207": "8009444",
        "174208": "8009444",
        "173903": "8011809",
        "173904": "8011809",
        "173833": "8009444",
        "173834": "8009444",
        "173837": "8009444",
        "173838": "8009444",
        "173909": "8011808",
        "173910": "8011808",
        "173919": "8011809",
        "173920": "8011809",
        "173835": "8009444",
        "173836": "8009444",
        "173911": "8011808",
        "173912": "8011808",
        "173921": "8011809",
        "173922": "8011809",
        "173915": "8011808",
        "173916": "8011808",
        "173925": "8011809",
        "173926": "8011809",
        "173895": "8011808",
        "173898": "8011808",
        "173899": "8011809",
        "173900": "8011809",
        "173907": "8011808",
        "173908": "8011808",
        "173901": "8011809",
        "173902": "8011809",
        "173905": "8011808",
        "173906": "8011808",
        "173917": "8011809",
        "173918": "8011809",
        "173849": "8012116",
        "173850": "8012116",
        "173851": "8012117",
        "173852": "8012117",
        "174039": "8009446",
        "173735": "8009446",
        "173759": "8009446",
        "173736": "8009446",
        "173760": "8009446",
        "173738": "8009446",
        "173762": "8009446",
        "173737": "8009446",
        "173761": "8009446",
        "173832": "8009446",
        "173869": "8009446",
        "174038": "8009446",
        "173830": "8009446",
        "173831": "8009446",
        "174040": "8009446",
        "174041": "8009446",
        "173739": "8009446",
        "173763": "8009446",
        "173778": "8009446",
        "173779": "8009446",
        "173780": "8009446",
        "173792": "8009446",
        "173781": "8009446",
        "173793": "8009446",
        "173782": "8009446",
        "173794": "8009446",
        "173783": "8009446",
        "173795": "8009446",
        "174028": "8009446",
        "174029": "8009446",
        "173784": "8009446",
        "173796": "8009446",
        "173785": "8009446",
        "173797": "8009446",
        "173786": "8009446",
        "173798": "8009446",
        "173787": "8009446",
        "173799": "8009446",
        "173788": "8009446",
        "173800": "8009446",
        "173789": "8009446",
        "173801": "8009446",
        "173790": "8009446",
        "173802": "8009446",
        "173791": "8009446",
        "173803": "8009446",
        "173740": "8009446",
        "173764": "8009446",
        "174094": "8009446",
        "174095": "8009446",
        "173741": "8009446",
        "173742": "8009446",
        "173743": "8009446",
        "173765": "8009446",
        "173754": "8009446",
        "173774": "8009446",
        "173744": "8009446",
        "173766": "8009446",
        "173755": "8009446",
        "173775": "8009446",
        "173745": "8009446",
        "173767": "8009446",
        "173756": "8009446",
        "173776": "8009446",
        "173746": "8009446",
        "173768": "8009446",
        "173747": "8009446",
        "173769": "8009446",
        "173748": "8009446",
        "173770": "8009446",
        "173753": "8009446",
        "173773": "8009446",
        "173758": "8009446",
        "173757": "8009446",
        "173777": "8009446",
        "174196": "8009446",
        "174197": "8009446",
        "173749": "8009446",
        "173771": "8009446",
        "173750": "8009446",
        "173751": "8009446",
        "173752": "8009446",
        "173772": "8009446",
        "173734": "8009446",
        "173955": "8009446",
        "173956": "8009446"
      };
 
      // Defaults
      let salescode = '20001139';
      let clearlinkeventid = '';
      const defaultTn = '1111111111';
      let tn = defaultTn;
 
      try {
        if (eventRequestId) {
          clearlinkeventid = eventRequestId;
          console.log('[QTM Cart Button Finder] Using requestId from event:', clearlinkeventid);
        }
 
        const parsedData =
          parsedMapiData ||
          (() => {
            const mapiData = localStorage.getItem('mapi');
            return mapiData ? JSON.parse(mapiData) : null;
          })();
 
        if (parsedData) {
          // Log the MAPI data structure for debugging
          console.log('[QTM Cart Button Finder] MAPI data structure found');
          console.log('[QTM Cart Button Finder] Root level keys:', Object.keys(parsedData));

          // Extract TN from phone > data > 0 > promo_number
          try {
            const promoNumber =
              parsedData?.requestData?.fullResponse?.data?.phone?.data?.[0]?.promo_number ??
              parsedData?.phone?.data?.[0]?.promo_number;
            if (promoNumber) {
              tn = String(promoNumber);
              console.log('[QTM Cart Button Finder] Extracted TN (promo_number) from mapi phone.data[0]:', tn);
            } else {
              console.log('[QTM Cart Button Finder] No promo_number found in mapi; using default TN:', tn);
            }
          } catch (e) {
            console.warn('[QTM Cart Button Finder] Error extracting promo_number for TN; using default TN:', tn, e);
          }
          
          // Extract request_id - check all possible locations if we don't already have it from the event
          if (!clearlinkeventid) {
            if (parsedData.requestId) {
              clearlinkeventid = parsedData.requestId;
              console.log('[QTM Cart Button Finder] Extracted requestId (ACSID) from root level:', clearlinkeventid);
            } else if (parsedData.requestData && parsedData.requestData.requestId) {
              clearlinkeventid = parsedData.requestData.requestId;
              console.log('[QTM Cart Button Finder] Extracted requestId (ACSID) from requestData:', clearlinkeventid);
            } else if (
              parsedData.requestData &&
              parsedData.requestData.fullResponse &&
              parsedData.requestData.fullResponse.data &&
              parsedData.requestData.fullResponse.data.request_id
            ) {
              clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
              console.log('[QTM Cart Button Finder] Extracted request_id (ACSID) from fullResponse.data:', clearlinkeventid);
            } else {
              console.log('[QTM Cart Button Finder] Could not find request_id in any expected location');
              // Log available paths to help debug
              if (parsedData.requestData) {
                console.log('[QTM Cart Button Finder] requestData keys:', Object.keys(parsedData.requestData));
                if (parsedData.requestData.fullResponse) {
                  console.log('[QTM Cart Button Finder] fullResponse keys:', Object.keys(parsedData.requestData.fullResponse));
                  if (parsedData.requestData.fullResponse.data) {
                    console.log('[QTM Cart Button Finder] fullResponse.data keys:', Object.keys(parsedData.requestData.fullResponse.data));
                  }
                }
              }
            }
          }
 
          // Extract promo_code - check all possible locations
          let promoCode = null;
          
          // First check in fullResponse.data.promo_code
          if (
            parsedData.requestData &&
            parsedData.requestData.fullResponse &&
            parsedData.requestData.fullResponse.data &&
            parsedData.requestData.fullResponse.data.promo_code
          ) {
            promoCode = parsedData.requestData.fullResponse.data.promo_code;
            console.log('[QTM Cart Button Finder] Extracted promo_code from fullResponse.data:', promoCode);
          } 
          // Then check in promo_data.data.promo_code
          else if (
            parsedData.requestData &&
            parsedData.requestData.fullResponse &&
            parsedData.requestData.fullResponse.data &&
            parsedData.requestData.fullResponse.data.promo_data &&
            parsedData.requestData.fullResponse.data.promo_data.data &&
            parsedData.requestData.fullResponse.data.promo_data.data.promo_code
          ) {
            promoCode = parsedData.requestData.fullResponse.data.promo_data.data.promo_code;
            console.log('[QTM Cart Button Finder] Extracted promo_code from promo_data.data:', promoCode);
          }
          // Check other possible locations
          else if (parsedData.promo_code) {
            promoCode = parsedData.promo_code;
            console.log('[QTM Cart Button Finder] Extracted promo_code from root level:', promoCode);
          } else if (parsedData.lastPromo) {
            promoCode = parsedData.lastPromo;
            console.log('[QTM Cart Button Finder] Extracted lastPromo from root level:', promoCode);
          } else {
            console.log('[QTM Cart Button Finder] Could not find promo_code in any expected location');
            // Log available paths to help debug
            if (parsedData.requestData && parsedData.requestData.fullResponse && parsedData.requestData.fullResponse.data) {
              console.log('[QTM Cart Button Finder] Available properties in fullResponse.data:', 
                          Object.keys(parsedData.requestData.fullResponse.data));
              if (parsedData.requestData.fullResponse.data.promo_data) {
                console.log('[QTM Cart Button Finder] promo_data keys:', 
                            Object.keys(parsedData.requestData.fullResponse.data.promo_data));
              }
            }
          }
 
          if (promoCode) {
            // Convert to string to ensure proper lookup
            promoCode = String(promoCode);
            console.log('[QTM Cart Button Finder] Extracted promo_code:', promoCode);
            
            // Look up the sales code from the mapping
            if (promoToSalesCodeMap[promoCode]) {
              salescode = promoToSalesCodeMap[promoCode];
              console.log('[QTM Cart Button Finder] Mapped to sales code:', salescode);
            } else {
              console.log('[QTM Cart Button Finder] No mapping found for promo code:', promoCode, 'using default sales code:', salescode);
            }
          } else {
            console.log('[QTM Cart Button Finder] No promo_code found in mapi data, using default sales code:', salescode);
          }
        }
      } catch (error) {
        console.error('[QTM Cart Button Finder] Error extracting data from mapi:', error);
      }
 
      // Build URL
      let buyflowUrl = `https://px-test-ordering.quantumfiber.com/index?partnerId=PX000131&BRND=Q&TN=${encodeURIComponent(
        tn
      )}&OSTR=2222222222&salescode=${salescode}&cookietime=30day${
        clearlinkeventid ? `&PartnerReferenceID=${clearlinkeventid}` : ''
      }`;

      function rebuildBuyflowUrl(values) {
        return `https://px-test-ordering.quantumfiber.com/index?partnerId=PX000131&BRND=Q&TN=${encodeURIComponent(
          values.tn
        )}&OSTR=2222222222&salescode=${values.salescode}&cookietime=30day${
          values.clearlinkeventid ? `&PartnerReferenceID=${values.clearlinkeventid}` : ''
        }`;
      }
 
      function ensureQtmCartCtaHoverStyle() {
        if (document.getElementById('qtm-cart-cta-hover-style')) return;
        const style = document.createElement('style');
        style.id = 'qtm-cart-cta-hover-style';
        style.textContent =
          'a.qtm-cart-link[data-qtm-injected="1"] .leshen-link-button:hover{background-color:#7b46ce!important;color:#fff!important;}' +
          'a.qtm-cart-link[data-qtm-injected="1"] .leshen-link-button:hover .button-text{color:#fff!important;}';
        document.head.appendChild(style);
      }

      // Process inside <main> > first <section> child
      function processScopedLinks(url) {
        const mainEl = document.querySelector('main');
        if (!mainEl) {
          console.log('[QTM Cart Button Finder] <main> not found; skipping scoped injection');
          return;
        }
 
        const firstSectionEl = (() => {
          for (const child of mainEl.children) {
            if (child && child.tagName && child.tagName.toLowerCase() === 'section') return child;
          }
          return null;
        })();
        if (!firstSectionEl) {
          console.log('[QTM Cart Button Finder] No <section> child found under <main>; skipping scoped injection');
          return;
        }
 
        // If we find the .leshen-form we won't insert anything (cart links still get updated globally)
        if (firstSectionEl.querySelector('.leshen-form')) {
          console.log('[QTM Cart Button Finder] .leshen-form found in scope; skipping CTA injection');
          return;
        }
 
        const telAnchor = firstSectionEl.querySelector('a[href^="tel:"]');
        if (!telAnchor) return;
 
        // Avoid duplicating if already injected (secondary button after tel link)
        if (firstSectionEl.querySelector('a.leshen-link-button-wrapper[data-qtm-injected="1"]')) {
          console.log('[QTM Cart Button Finder] CTA already injected; skipping');
          return;
        }
 
        // Add a unique ID to make it easier to find and re-inject if removed
        const buttonId = 'qtm-injected-button-' + Math.floor(Math.random() * 10000);
        ensureQtmCartCtaHoverStyle();
        const newButtonHtml = `
          <a id="${buttonId}" class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 qtm-cart-link" href="${url}" data-qtm-injected="1" visibility="All devices" style="
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
                  padding: 12px 20px !important;
                  font: inherit !important;
                  color: #000 !important;
                  background-color: #ffffff4d;
                  border: 0 !important;
                  border-radius: 2em !important;
                  cursor: pointer !important;
                  -webkit-transition: all 0.3s !important;
                  transition: all 0.3s !important;
                  -webkit-appearance: button !important;
                  box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.1) !important;
                  margin-top: 1rem !important;
                  position: relative !important;
                  z-index: 9999 !important;
                  pointer-events: auto !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                  border: 2px solid #ad80e1 !important;
              ">
                  <span class="button-text css-2qtueq e1hk20aw0" style="
                      font-weight: 500;
                      font-size: calc(0.75vw + 0.5rem);
                      line-height: calc(1.1111111111111112vw + 0.75rem);
                      pointer-events: auto !important;
                      display: inline !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                  ">Order Online</span>
              </button>
          </a>`;

        try {
          try {
            telAnchor.insertAdjacentHTML('afterend', newButtonHtml);
            console.log('[QTM Cart Button Finder] Injected buyflow CTA after tel: link');
          } catch (innerError) {
            console.warn('[QTM Cart Button Finder] Primary insertion method failed, trying alternative', innerError);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newButtonHtml;
            const buttonElement = tempDiv.firstElementChild;
            telAnchor.parentNode.insertBefore(buttonElement, telAnchor.nextSibling);
            console.log('[QTM Cart Button Finder] Injected buyflow CTA using alternative method');
          }
          protectInjectedElements();
        } catch (e) {
          console.error('[QTM Cart Button Finder] All scoped injection methods failed', e);
        }
      }
 
      // Process all cart links on the entire page
      function processAllCartLinks(url) {
        console.log('[QTM Cart Button Finder] Searching for all cart links on the page');
        // Updated selector to catch both href="/cart" exactly and href containing "/cart"
        const allCartLinks = document.querySelectorAll('a[href="/cart"], a[href*="/cart"]');
        
        if (allCartLinks.length === 0) {
          console.log('[QTM Cart Button Finder] No cart links found on the page');
          return;
        }
        
        console.log(`[QTM Cart Button Finder] Found ${allCartLinks.length} cart links on the page`);
        
        allCartLinks.forEach((link, index) => {
          try {
            // Skip links that were already processed by processScopedLinks
            if (link.dataset.qtmUpdated === '1') {
              console.log(`[QTM Cart Button Finder] Skipping already updated cart link #${index + 1}`);
              return;
            }
            
            link.href = url;
            link.dataset.qtmUpdated = '1';
            console.log(`[QTM Cart Button Finder] Updated cart link #${index + 1}`);
          } catch (e) {
            console.error(`[QTM Cart Button Finder] Failed updating cart link #${index + 1}`, e);
          }
        });
      }
 
      // Initial values snapshot and initial apply
      const initialValues = { salescode, clearlinkeventid, tn };
   
      // Add a global verification flag to track successful URL modifications
      window.qtmCartButtonFinderSuccess = false;
   
      processScopedLinks(buyflowUrl);
      processAllCartLinks(buyflowUrl);

      // If TN wasn't available yet, retry briefly after init/event.
      // mapiRequestIdReady often fires before phone.data[0].promo_number is present.
      (function retryPopulateTn() {
        let attemptsLeft = 25; // ~5s @ 200ms
        const tick = () => {
          attemptsLeft--;
          const updatedValues = extractMapiValues();
          if (updatedValues.tn && updatedValues.tn !== tn) {
            console.log(`[QTM Cart Button Finder] TN became available: ${tn} -> ${updatedValues.tn}. Updating URLs...`);
            tn = updatedValues.tn;
            buyflowUrl = rebuildBuyflowUrl({
              salescode: updatedValues.salescode,
              clearlinkeventid: updatedValues.clearlinkeventid,
              tn: updatedValues.tn,
            });
            processScopedLinks(buyflowUrl);
            processAllCartLinks(buyflowUrl);
            return;
          }
          if (attemptsLeft > 0 && tn === defaultTn) {
            setTimeout(tick, 200);
          }
        };
        if (tn === defaultTn) setTimeout(tick, 200);
      })();
   
      // Check if initial application was successful
      const initialInjectedElements = document.querySelectorAll('[data-qtm-injected="1"]');
      const initialUpdatedElements = document.querySelectorAll('[data-qtm-updated="1"]');
   
      if (initialInjectedElements.length > 0 || initialUpdatedElements.length > 0) {
        console.log('[QTM Cart Button Finder] Initial URL modifications successful');
        window.qtmCartButtonFinderSuccess = true;
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
            console.log(`[QTM Cart Button Finder] Scheduled re-injection check after ${delay}ms`);
           
           // If we've already verified success and elements are still present, don't reapply
           if (window.qtmCartButtonFinderSuccess) {
             const currentElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
             if (currentElements.length > 0) {
               console.log('[QTM Cart Button Finder] URL modifications already verified successful, skipping re-injection');
               return;
             }
           }
           
           const injectedElements = document.querySelectorAll('[data-qtm-injected="1"]');
           const updatedElements = document.querySelectorAll('[data-qtm-updated="1"]');
           
           if (injectedElements.length === 0 || updatedElements.length === 0) {
             console.log('[QTM Cart Button Finder] Scheduled re-injection: Missing elements detected, re-applying');
             processScopedLinks(url);
             processAllCartLinks(url);
             
             // Check if this re-injection was successful
             setTimeout(() => {
               const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
               if (newElements.length > 0) {
                 console.log('[QTM Cart Button Finder] Re-injection successful, marking as verified');
                 window.qtmCartButtonFinderSuccess = true;
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
           console.log('[QTM Cart Button Finder] Ending continuous checks after 5 minutes');
           return;
         }
         
         checkCount++;
         
         // If we've already verified success and elements are still present, don't reapply
         if (window.qtmCartButtonFinderSuccess) {
           const currentElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
           if (currentElements.length > 0) {
             console.log('[QTM Cart Button Finder] Continuous check: URL modifications already verified successful, skipping');
             return;
           }
         }
         
         const injectedElements = document.querySelectorAll('[data-qtm-injected="1"]');
         const updatedElements = document.querySelectorAll('[data-qtm-updated="1"]');
         
         if (injectedElements.length === 0 || updatedElements.length === 0) {
           console.log('[QTM Cart Button Finder] Continuous check: Missing elements detected, re-applying');
           processScopedLinks(url);
           processAllCartLinks(url);
           
           // Check if this re-injection was successful
           setTimeout(() => {
             const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
             if (newElements.length > 0) {
               console.log('[QTM Cart Button Finder] Continuous check re-injection successful, marking as verified');
               window.qtmCartButtonFinderSuccess = true;
             }
           }, 100);
         }
         
        }, 5000); // Check every 5 seconds
      }
      
      // Function to protect injected elements from removal
      function protectInjectedElements() {
        const injectedElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
        
        injectedElements.forEach(element => {
          // Make it harder to remove the element
          const originalRemove = element.remove;
          element.remove = function() {
            console.log('[QTM Cart Button Finder] Prevented removal of injected element');
            return false;
          };
          
          // Prevent style changes that would hide the element
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name, value) {
            if (name === 'style' && (value.includes('display: none') || value.includes('visibility: hidden') || value.includes('opacity: 0'))) {
              console.log('[QTM Cart Button Finder] Prevented style attribute change that would hide element');
              return false;
            }
            return originalSetAttribute.call(this, name, value);
          };
          
          // Prevent class changes that might hide the element
          const originalClassListAdd = element.classList.add;
          element.classList.add = function(className) {
            if (className.includes('hidden') || className.includes('invisible') || className.includes('removed')) {
              console.log('[QTM Cart Button Finder] Prevented adding class that might hide element:', className);
              return false;
            }
            return originalClassListAdd.call(this, className);
          };
        });
      }
      
      // Function to set up mutation observer to detect when our buttons are removed
      function setupMutationObserver(url) {
        console.log('[QTM Cart Button Finder] Setting up MutationObserver to monitor button removal');
        
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
                  if (node.dataset && node.dataset.qtmInjected === '1' || node.dataset && node.dataset.qtmUpdated === '1') {
                    console.log('[QTM Cart Button Finder] Detected removal of our injected/updated element');
                    needToReapply = true;
                    break;
                  }
                  
                  // Also check if any of the removed node's children had our data attribute
                  if (node.querySelector && node.querySelector('[data-qtm-injected="1"], [data-qtm-updated="1"]')) {
                    console.log('[QTM Cart Button Finder] Detected removal of a container with our injected/updated elements');
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
            if (window.qtmCartButtonFinderSuccess) {
              console.log('[QTM Cart Button Finder] Elements removed but URL modifications already verified successful, skipping re-application');
            } else {
              console.log('[QTM Cart Button Finder] Re-applying button modifications after detected removal');
              setTimeout(() => {
                processScopedLinks(url);
                processAllCartLinks(url);
                
                // Check if this re-injection was successful
                setTimeout(() => {
                  const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
                  if (newElements.length > 0) {
                    console.log('[QTM Cart Button Finder] MutationObserver re-injection successful, marking as verified');
                    window.qtmCartButtonFinderSuccess = true;
                  }
                }, 100);
              }, 100); // Small delay to ensure DOM is settled
            }
          }
        });
        
        // Also set up a periodic check as a fallback
        setInterval(() => {
          // If we've already verified success, skip the check
          if (window.qtmCartButtonFinderSuccess) {
            return;
          }
         
          const injectedElements = document.querySelectorAll('[data-qtm-injected="1"]');
          const updatedElements = document.querySelectorAll('[data-qtm-updated="1"]');
          
          // If we expected elements to be there but they're not, reapply
          if ((injectedElements.length === 0 && updatedElements.length === 0)) {
            console.log('[QTM Cart Button Finder] Periodic check: No injected/updated elements found, re-applying');
            processScopedLinks(url);
            processAllCartLinks(url);
            
            // Check if this re-injection was successful
            setTimeout(() => {
              const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
              if (newElements.length > 0) {
                console.log('[QTM Cart Button Finder] Periodic check re-injection successful, marking as verified');
                window.qtmCartButtonFinderSuccess = true;
              }
            }, 100);
          }
        }, 2000); // Check every 2 seconds
      }
 
      // Re-check on load
      window.addEventListener('load', function () {
        console.log('[QTM Cart Button Finder] Page fully loaded, checking mapi values again...');

        const updatedValues = extractMapiValues();
        let valuesChanged = false;
 
        if (updatedValues.salescode !== initialValues.salescode) {
          console.log(`Sales code changed: ${initialValues.salescode} -> ${updatedValues.salescode}`);
          valuesChanged = true;
        }
        if (updatedValues.clearlinkeventid !== initialValues.clearlinkeventid) {
          console.log(`ACSID changed: ${initialValues.clearlinkeventid} -> ${updatedValues.clearlinkeventid}`);
          valuesChanged = true;
        }
        if (updatedValues.tn !== initialValues.tn) {
          console.log(`TN changed: ${initialValues.tn} -> ${updatedValues.tn}`);
          valuesChanged = true;
        }
 
        if (valuesChanged) {
          console.log('[QTM Cart Button Finder] Values changed after page load, updating button URLs...');
          buyflowUrl = rebuildBuyflowUrl(updatedValues);
          processScopedLinks(buyflowUrl);
          processAllCartLinks(buyflowUrl);
          
          // Check if this update was successful
          setTimeout(() => {
            const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
            if (newElements.length > 0) {
              console.log('[QTM Cart Button Finder] Load-time update successful, marking as verified');
              window.qtmCartButtonFinderSuccess = true;
            }
          }, 100);
        } else {
          console.log('[QTM Cart Button Finder] No changes to mapi values after page load');
        }
      });
 
      function extractMapiValues() {
        let extractedValues = {
          salescode: initialValues.salescode,
          clearlinkeventid: initialValues.clearlinkeventid,
          promoCode: null,
          tn: initialValues.tn,
        };
 
        try {
          const mapiData = localStorage.getItem('mapi');
          if (mapiData) {
            const parsedData = JSON.parse(mapiData);
 
            console.log('[QTM Cart Button Finder] Re-extracting values from mapi data');

            // Extract TN from phone > data > 0 > promo_number
            try {
              const promoNumber =
                parsedData?.requestData?.fullResponse?.data?.phone?.data?.[0]?.promo_number ??
                parsedData?.phone?.data?.[0]?.promo_number;
              if (promoNumber) extractedValues.tn = String(promoNumber);
            } catch (e) {
              // keep default tn
            }
            
            // Extract request_id - check all possible locations
            if (parsedData.requestId) {
              extractedValues.clearlinkeventid = parsedData.requestId;
              console.log('[QTM Cart Button Finder] Found requestId at root level:', extractedValues.clearlinkeventid);
            } else if (parsedData.requestData && parsedData.requestData.requestId) {
              extractedValues.clearlinkeventid = parsedData.requestData.requestId;
              console.log('[QTM Cart Button Finder] Found requestId in requestData:', extractedValues.clearlinkeventid);
            } else if (
              parsedData.requestData &&
              parsedData.requestData.fullResponse &&
              parsedData.requestData.fullResponse.data &&
              parsedData.requestData.fullResponse.data.request_id
            ) {
              extractedValues.clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
              console.log('[QTM Cart Button Finder] Found request_id in fullResponse.data:', extractedValues.clearlinkeventid);
            }
 
            // Extract promo_code - check all possible locations
            let promoCode = null;
            
            // First check in fullResponse.data.promo_code
            if (
              parsedData.requestData &&
              parsedData.requestData.fullResponse &&
              parsedData.requestData.fullResponse.data &&
              parsedData.requestData.fullResponse.data.promo_code
            ) {
              promoCode = parsedData.requestData.fullResponse.data.promo_code;
              console.log('[QTM Cart Button Finder] Found promo_code in fullResponse.data:', promoCode);
            } 
            // Then check in promo_data.data.promo_code
            else if (
              parsedData.requestData &&
              parsedData.requestData.fullResponse &&
              parsedData.requestData.fullResponse.data &&
              parsedData.requestData.fullResponse.data.promo_data &&
              parsedData.requestData.fullResponse.data.promo_data.data &&
              parsedData.requestData.fullResponse.data.promo_data.data.promo_code
            ) {
              promoCode = parsedData.requestData.fullResponse.data.promo_data.data.promo_code;
              console.log('[QTM Cart Button Finder] Found promo_code in promo_data.data:', promoCode);
            }
            // Check other possible locations
            else if (parsedData.promo_code) {
              promoCode = parsedData.promo_code;
              console.log('[QTM Cart Button Finder] Found promo_code at root level:', promoCode);
            } else if (parsedData.lastPromo) {
              promoCode = parsedData.lastPromo;
              console.log('[QTM Cart Button Finder] Found lastPromo at root level:', promoCode);
            }
 
            if (promoCode) {
              extractedValues.promoCode = String(promoCode);
              if (promoToSalesCodeMap[extractedValues.promoCode]) {
                extractedValues.salescode = promoToSalesCodeMap[extractedValues.promoCode];
              }
            }
          }
        } catch (error) {
          console.error('[QTM Cart Button Finder] Error re-extracting data from mapi:', error);
        }
 
        return extractedValues;
      }
 
      console.log('[QTM Cart Button Finder] Main script execution completed');
    }
 
    // Script initialization occurs via event listener/localStorage
 })();