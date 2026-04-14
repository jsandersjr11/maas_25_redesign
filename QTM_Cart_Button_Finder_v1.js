(function () {
    const DEBUG = false;
    const log = (...args) => DEBUG && console.log('[QTM Cart Button Finder]', ...args);
    const warn = (...args) => DEBUG && console.warn('[QTM Cart Button Finder]', ...args);
    const error = (...args) => console.error('[QTM Cart Button Finder]', ...args);

    log('Script initialized');
 
    // Start fast (React/VWO friendly) with defaults, then upgrade when MAPI arrives.
    let controller = null;
    let booted = false;
    function bootFast() {
      if (booted) return;
      booted = true;
      try {
        controller = initializeMainScript(null, null);
      } catch (e) {
        error('Fast boot failed', e);
      }
    }
    // Next-tick boot so we don’t block VWO’s main thread
    setTimeout(bootFast, 0);
 
    // Listen for the mapiRequestIdReady event
    document.addEventListener('mapiRequestIdReady', (e) => {
      log('mapiRequestIdReady event received');
      const requestId = e?.detail?.requestId;
      log('Request ID from event:', requestId);
 
      if (!requestId) {
        log('Event received but no requestId found in event details');
        return;
      }

      // Always boot fast; then upgrade URL if/when we can.
      bootFast();
      try {
        const mapiData = localStorage.getItem('mapi');
        const parsedData = mapiData ? JSON.parse(mapiData) : { requestId };
        if (controller && controller.updateFromMapi) controller.updateFromMapi(parsedData, requestId);
      } catch (e2) {
        warn('Error processing MAPI data from event; falling back to requestId only', e2);
        if (controller && controller.updateFromMapi) controller.updateFromMapi({ requestId }, requestId);
      }
    });
 
    // Also check localStorage immediately in case the event has already fired
    try {
      const mapiData = localStorage.getItem('mapi');
      if (mapiData) {
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
          log('MAPI data already exists in localStorage with requestId');
          bootFast();
          if (controller && controller.updateFromMapi) controller.updateFromMapi(parsedData, null);
        }
      }
    } catch (error) {
      warn('Error checking initial localStorage', error);
    }
 
    function initializeMainScript(parsedMapiData = null, eventRequestId = null) {
      log('Initializing main script');
 
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
      let salescode = '8009446';
      let clearlinkeventid = '';
      const defaultTn = '1111111111';
      let tn = defaultTn;
 
      function isLikelyTn(value) {
        if (value == null) return false;
        const digits = String(value).replace(/\D/g, '');
        return digits.length === 10;
      }

      function normalizeTn(value) {
        const digits = String(value).replace(/\D/g, '');
        return digits.length === 10 ? digits : null;
      }

      function extractTnFromMapi(parsedData) {
        // Preferred known paths (keep cheap/fast)
        const phone0 =
          parsedData?.requestData?.fullResponse?.data?.phone?.data?.[0] ??
          parsedData?.phone?.data?.[0] ??
          null;

        const directCandidates = [
          phone0?.promo_number,
          phone0?.promoNumber,
          phone0?.tn,
          phone0?.TN,
          phone0?.phone_number,
          phone0?.phoneNumber,
          phone0?.number,
          phone0?.phone,
          phone0?.tel,
          parsedData?.tn,
          parsedData?.TN,
        ];

        for (const c of directCandidates) {
          if (isLikelyTn(c)) return normalizeTn(c);
        }

        // If phone0 exists, scan its values for a 10-digit number
        if (phone0 && typeof phone0 === 'object') {
          for (const v of Object.values(phone0)) {
            if (isLikelyTn(v)) return normalizeTn(v);
          }
        }

        return null;
      }

      function extractTnFromDom() {
        // Use the first visible tel: link as a guaranteed TN source on this page.
        // (MAPI can be missing/expired, but the CTA tel link is usually present.)
        const telAnchor =
          document.querySelector('main a[href^="tel:"]') ||
          document.querySelector('a[href^="tel:"]');
        if (!telAnchor) return null;

        const href = telAnchor.getAttribute('href') || '';
        const digits = href.replace(/\D/g, '');
        if (digits.length === 10) return digits;
        if (digits.length > 10) {
          // Sometimes tel:+1XXXXXXXXXX
          const last10 = digits.slice(-10);
          if (last10.length === 10) return last10;
        }
        return null;
      }

      function maybeUpgradeTnFromDom() {
        if (tn !== defaultTn) return false;
        const domTn = extractTnFromDom();
        if (!domTn) return false;
        tn = domTn;
        buyflowUrl = rebuildBuyflowUrl({ salescode, clearlinkeventid, tn });
        processAllCartLinks(buyflowUrl);
        ensureScopedCta(buyflowUrl);
        processScopedLinks(buyflowUrl, false);
        return true;
      }

      try {
        if (eventRequestId) {
          clearlinkeventid = eventRequestId;
          log('Using requestId from event:', clearlinkeventid);
        }
 
        const parsedData =
          parsedMapiData ||
          (() => {
            const mapiData = localStorage.getItem('mapi');
            return mapiData ? JSON.parse(mapiData) : null;
          })();
 
        if (parsedData) {
          // Avoid expensive logging unless DEBUG
          log('MAPI data structure found');
          log('Root level keys:', Object.keys(parsedData));

          // Extract TN (field name varies by implementation)
          try {
            const extractedTn = extractTnFromMapi(parsedData);
            if (extractedTn) {
              tn = String(extractedTn);
              log('Extracted TN from mapi:', tn);
            } else {
              log('No promo_number found in mapi; using default TN:', tn);
            }
          } catch (e) {
            warn('Error extracting promo_number for TN; using default TN', tn, e);
          }
          
          // Extract request_id - check all possible locations if we don't already have it from the event
          if (!clearlinkeventid) {
            if (parsedData.requestId) {
              clearlinkeventid = parsedData.requestId;
              log('Extracted requestId (ACSID) from root level:', clearlinkeventid);
            } else if (parsedData.requestData && parsedData.requestData.requestId) {
              clearlinkeventid = parsedData.requestData.requestId;
              log('Extracted requestId (ACSID) from requestData:', clearlinkeventid);
            } else if (
              parsedData.requestData &&
              parsedData.requestData.fullResponse &&
              parsedData.requestData.fullResponse.data &&
              parsedData.requestData.fullResponse.data.request_id
            ) {
              clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
              log('Extracted request_id (ACSID) from fullResponse.data:', clearlinkeventid);
            } else {
              log('Could not find request_id in expected locations');
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
            log('Extracted promo_code from fullResponse.data:', promoCode);
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
            log('Extracted promo_code from promo_data.data:', promoCode);
          }
          // Check other possible locations
          else if (parsedData.promo_code) {
            promoCode = parsedData.promo_code;
            log('Extracted promo_code from root level:', promoCode);
          } else if (parsedData.lastPromo) {
            promoCode = parsedData.lastPromo;
            log('Extracted lastPromo from root level:', promoCode);
          } else {
            log('Could not find promo_code in expected locations');
          }
 
          if (promoCode) {
            // Convert to string to ensure proper lookup
            promoCode = String(promoCode);
            log('Extracted promo_code:', promoCode);
            
            // Look up the sales code from the mapping
            if (promoToSalesCodeMap[promoCode]) {
              salescode = promoToSalesCodeMap[promoCode];
              log('Mapped to sales code:', salescode);
            } else {
              log('No mapping found for promo code:', promoCode, 'using default sales code:', salescode);
            }
          } else {
            log('No promo_code found in mapi data; using default sales code:', salescode);
          }
        }
      } catch (error) {
        warn('Error extracting data from mapi', error);
      }
 
      // If MAPI is missing/expired, derive TN from the tel: link as soon as possible.
      // This makes TN update "always" on the React page.
      try {
        maybeUpgradeTnFromDom();
      } catch (e) {
        // ignore
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
      let scopedCtaInjected = false;
      function processScopedLinks(url, allowInject = false) {
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
 
        // If CTA already exists in scope, only update its href (no reinsertion/flicker)
        const existingCta = firstSectionEl.querySelector('a.leshen-link-button-wrapper[data-qtm-injected="1"]');
        if (existingCta) {
          try {
            if (existingCta.href !== url) existingCta.href = url;
          } catch (e) {
            // ignore
          }
          scopedCtaInjected = true;
          return;
        }
 
        // Only inject once, and only when explicitly allowed (e.g. after load)
        if (scopedCtaInjected || !allowInject) return;

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
            scopedCtaInjected = true;
          } catch (innerError) {
            console.warn('[QTM Cart Button Finder] Primary insertion method failed, trying alternative', innerError);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newButtonHtml;
            const buttonElement = tempDiv.firstElementChild;
            telAnchor.parentNode.insertBefore(buttonElement, telAnchor.nextSibling);
            console.log('[QTM Cart Button Finder] Injected buyflow CTA using alternative method');
            scopedCtaInjected = true;
          }
        } catch (e) {
          console.error('[QTM Cart Button Finder] All scoped injection methods failed', e);
        }
      }

      function hasInjectedCta() {
        return document.querySelector('[data-qtm-injected="1"]') != null;
      }

      // React pages can render tel link later; keep trying briefly until we can inject once.
      let ensureScopedCtaTimerId = null;
      let lastEnsureScopedCtaAt = 0;
      function ensureScopedCta(url, { maxMs = 15000, intervalMs = 250 } = {}) {
        const now = Date.now();
        if (now - lastEnsureScopedCtaAt < 200) return; // throttle bursts
        lastEnsureScopedCtaAt = now;

        if (hasInjectedCta()) return;

        if (ensureScopedCtaTimerId) {
          // a loop is already running; it will pick up the latest url via closure below
          return;
        }

        const startedAt = Date.now();
        ensureScopedCtaTimerId = setInterval(() => {
          // stop conditions
          if (hasInjectedCta()) {
            clearInterval(ensureScopedCtaTimerId);
            ensureScopedCtaTimerId = null;
            return;
          }
          if (Date.now() - startedAt > maxMs) {
            clearInterval(ensureScopedCtaTimerId);
            ensureScopedCtaTimerId = null;
            return;
          }

          // If we still don't have a TN, attempt to grab it from the tel: link once it renders.
          try {
            if (maybeUpgradeTnFromDom()) {
              url = buyflowUrl; // keep loop using latest url
            }
          } catch (e) {
            // ignore
          }

          // allowInject=true so we can insert when tel link appears
          processScopedLinks(url, true);
        }, intervalMs);
      }
 
      // Process all cart links on the entire page
      function processAllCartLinks(url) {
        log('Searching for all cart links on the page');
        // Updated selector to catch both href="/cart" exactly and href containing "/cart"
        const allCartLinks = document.querySelectorAll('a[href="/cart"], a[href*="/cart"]');
        
        if (allCartLinks.length === 0) {
          log('No cart links found on the page');
          return;
        }
        
        log(`Found ${allCartLinks.length} cart links on the page`);
        
        allCartLinks.forEach((link, index) => {
          try {
            // Skip links that were already processed by processScopedLinks
            if (link.dataset.qtmUpdated === '1') {
              log(`Skipping already updated cart link #${index + 1}`);
              return;
            }
            
            link.href = url;
            link.dataset.qtmUpdated = '1';
            log(`Updated cart link #${index + 1}`);
          } catch (e) {
            warn(`Failed updating cart link #${index + 1}`, e);
          }
        });
      }
 
      // Initial values snapshot and initial apply
      const initialValues = { salescode, clearlinkeventid, tn };
   
      // Add a global verification flag to track successful URL modifications
      window.qtmCartButtonFinderSuccess = false;
   
      processAllCartLinks(buyflowUrl);
      ensureScopedCta(buyflowUrl);

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
            processScopedLinks(buyflowUrl, false);
            processAllCartLinks(buyflowUrl);
            ensureScopedCta(buyflowUrl);
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
      
      // Function to set up mutation observer to detect when our buttons are removed
      function setupMutationObserver(url) {
        log('Setting up MutationObserver to monitor button removal');
        
        // Create an observer instance
        const observer = new MutationObserver((mutations) => {
          let needToReapply = false;
          let shouldEnsure = false;
          
          mutations.forEach((mutation) => {
            // Check if nodes were removed
            if (mutation.removedNodes.length > 0) {
              // Check if any of our injected/updated elements were removed
              for (let i = 0; i < mutation.removedNodes.length; i++) {
                const node = mutation.removedNodes[i];
                
                // Check if the node is an element and has our data attribute or contains elements with our attribute
                if (node.nodeType === 1) { // ELEMENT_NODE
                  if (node.dataset && node.dataset.qtmInjected === '1' || node.dataset && node.dataset.qtmUpdated === '1') {
                    log('Detected removal of our injected/updated element');
                    needToReapply = true;
                    break;
                  }
                  
                  // Also check if any of the removed node's children had our data attribute
                  if (node.querySelector && node.querySelector('[data-qtm-injected="1"], [data-qtm-updated="1"]')) {
                    log('Detected removal of a container with our injected/updated elements');
                    needToReapply = true;
                    break;
                  }
                }
              }
            }

            // If nodes were added, React may have just rendered the tel: link we need
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
              shouldEnsure = true;
            }
          });
          
          // If our elements were removed, reapply them (React re-renders can remove injected DOM)
          if (needToReapply) {
            log('Re-applying modifications after detected removal');
            setTimeout(() => {
              processScopedLinks(url, true);
              processAllCartLinks(url);
              ensureScopedCta(url);
            }, 0); // next tick so DOM can settle
          }

          if (shouldEnsure) {
            ensureScopedCta(url);
          }
        });

        // IMPORTANT: start observing. Without this, the observer never runs.
        try {
          const target = document.querySelector('main') || document.body;
          if (target) observer.observe(target, { childList: true, subtree: true });
        } catch (e) {
          // ignore
        }
        
        // Start ensuring immediately (handles "tel:" rendering after init)
        ensureScopedCta(url);

        // Periodic fallback, but only for a limited time (avoid permanent overhead in VWO).
        const startedAt = Date.now();
        const maxFallbackMs = 30000;
        const intervalId = setInterval(() => {
          if (window.qtmCartButtonFinderSuccess) {
            clearInterval(intervalId);
            return;
          }
          if (Date.now() - startedAt > maxFallbackMs) {
            clearInterval(intervalId);
            return;
          }
          const injectedElements = document.querySelectorAll('[data-qtm-injected="1"]');
          const updatedElements = document.querySelectorAll('[data-qtm-updated="1"]');
          
          // If we expected elements to be there but they're not, reapply
          if ((injectedElements.length === 0 && updatedElements.length === 0)) {
            log('Periodic check: No injected/updated elements found, re-applying');
            processScopedLinks(url, true);
            processAllCartLinks(url);
            ensureScopedCta(url);
            
            // Check if this re-injection was successful
            setTimeout(() => {
              const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
              if (newElements.length > 0) {
                log('Periodic check re-injection successful, marking as verified');
                window.qtmCartButtonFinderSuccess = true;
              }
            }, 100);
          }
        }, 1500); // keep light while waiting for React renders
      }
 
      function runOnceAfterLoad(fn) {
        if (document.readyState === 'complete') {
          fn();
          return;
        }
        window.addEventListener('load', fn, { once: true });
      }

      // Re-check on load (or immediately if load already happened)
      runOnceAfterLoad(function () {
        log('Page fully loaded, checking mapi values again...');

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
          log('Values changed after page load, updating button URLs...');
          buyflowUrl = rebuildBuyflowUrl(updatedValues);
          processAllCartLinks(buyflowUrl);
          // Only inject CTA once, after load (prevents appear/disappear flicker)
          setTimeout(() => processScopedLinks(buyflowUrl, true), 0);
          ensureScopedCta(buyflowUrl);
          
          // Check if this update was successful
          setTimeout(() => {
            const newElements = document.querySelectorAll('[data-qtm-injected="1"], [data-qtm-updated="1"]');
            if (newElements.length > 0) {
              console.log('[QTM Cart Button Finder] Load-time update successful, marking as verified');
              window.qtmCartButtonFinderSuccess = true;
            }
          }, 100);
        } else {
          // Even if values didn't change, we still inject once after load (if needed).
          setTimeout(() => processScopedLinks(buyflowUrl, true), 0);
          ensureScopedCta(buyflowUrl);
          // One more chance to upgrade TN from DOM post-load.
          try {
            maybeUpgradeTnFromDom();
          } catch (e) {
            // ignore
          }
          log('No changes to mapi values after page load');
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
 
            log('Re-extracting values from mapi data');

            // Extract TN (field name varies by implementation)
            try {
              const extractedTn = extractTnFromMapi(parsedData);
              if (extractedTn) extractedValues.tn = String(extractedTn);
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
 
      log('Main script execution completed');

      // Allow fast-boot + later upgrade without reinitializing everything.
      return {
        updateFromMapi(nextMapiData, nextEventRequestId) {
          try {
            const updatedValues = (() => {
              // Prefer explicit args when available to avoid extra localStorage parse.
              let extractedValues = {
                salescode,
                clearlinkeventid,
                tn,
              };

              if (nextEventRequestId) extractedValues.clearlinkeventid = String(nextEventRequestId);

              const parsedData = nextMapiData || null;
              if (!parsedData) return extractedValues;

              // TN
              const extractedTn = extractTnFromMapi(parsedData);
              if (extractedTn) extractedValues.tn = String(extractedTn);

              // request id
              if (!extractedValues.clearlinkeventid) {
                extractedValues.clearlinkeventid =
                  parsedData.requestId ||
                  parsedData?.requestData?.requestId ||
                  parsedData?.requestData?.fullResponse?.data?.request_id ||
                  '';
              }

              // promo code -> salescode
              const promoCode =
                parsedData?.requestData?.fullResponse?.data?.promo_code ||
                parsedData?.requestData?.fullResponse?.data?.promo_data?.data?.promo_code ||
                parsedData?.promo_code ||
                parsedData?.lastPromo ||
                null;
              if (promoCode != null) {
                const promoStr = String(promoCode);
                if (promoToSalesCodeMap[promoStr]) extractedValues.salescode = promoToSalesCodeMap[promoStr];
              }

              return extractedValues;
            })();

            const nextUrl = rebuildBuyflowUrl({
              salescode: updatedValues.salescode,
              clearlinkeventid: updatedValues.clearlinkeventid,
              tn: updatedValues.tn || tn,
            });

            // Update internal state so subsequent retries use the best-known values
            salescode = updatedValues.salescode || salescode;
            clearlinkeventid = updatedValues.clearlinkeventid || clearlinkeventid;
            tn = updatedValues.tn || tn;
            buyflowUrl = nextUrl;

            processAllCartLinks(buyflowUrl);
            // avoid reinsertion flicker; just ensure if missing
            ensureScopedCta(buyflowUrl);
            // update existing injected CTA href if present
            processScopedLinks(buyflowUrl, false);
          } catch (e) {
            warn('updateFromMapi failed', e);
          }
        },
      };
    }
 
    // Script initialization occurs via event listener/localStorage
 })();