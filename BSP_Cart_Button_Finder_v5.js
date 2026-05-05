(function () {
  const DEBUG = false;
  const log = (...args) => DEBUG && console.log('[BSP Cart Button Finder]', ...args);
  const warn = (...args) => DEBUG && console.warn('[BSP Cart Button Finder]', ...args);
  const error = (...args) => console.error('[BSP Cart Button Finder]', ...args);

  log('Script initialized');

  // Boot immediately (React/VWO friendly), then upgrade once MAPI/event arrives.
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
  setTimeout(bootFast, 0);

  // Listen for the mapiRequestIdReady event
  document.addEventListener('mapiRequestIdReady', (e) => {
    const requestId = e?.detail?.requestId;
    if (!requestId) return;

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
        bootFast();
        if (controller && controller.updateFromMapi) controller.updateFromMapi(parsedData, null);
      }
    }
  } catch (e3) {
    warn('Error checking initial localStorage', e3);
  }

  function initializeMainScript(parsedMapiData = null, eventRequestId = null) {
    log('Initializing main script');

    // Define the promo code to sales code mapping (unchanged from v4)
    const promoToSalesCodeMap = {
      "162677": "20001141",
      "162668": "20001141",
      "169046": "20001137",
      "169047": "20001139",
      "169048": "20001139",
      "169049": "20001139",
      "169050": "20001139",
      "169051": "20001139",
      "169052": "20001137",
      "169053": "20001139",
      "169054": "20001139",
      "169055": "20001139",
      "169056": "20001139",
      "169057": "20001139",
      "169289": "20001139",
      "169290": "20001142",
      "169291": "20001142",
      "169292": "20001142",
      "169293": "20001142",
      "169294": "20001139",
      "169295": "20001142",
      "169296": "20001142",
      "169297": "20001142",
      "169298": "20001142",
      "169343": "20001142",
      "169344": "20001142",
      "169345": "20001142",
      "169349": "20001142",
      "169350": "20001142",
      "169351": "20001142",
      "169323": "20001137",
      "169324": "20001139",
      "169325": "20001139",
      "169326": "20001139",
      "169327": "20001139",
      "169328": "20001139",
      "169329": "20001142",
      "169330": "20001142",
      "169331": "20001142",
      "169332": "20001142",
      "169333": "20001137",
      "169334": "20001139",
      "169335": "20001139",
      "169336": "20001139",
      "169337": "20001139",
      "169338": "20001139",
      "169339": "20001142",
      "169340": "20001142",
      "169341": "20001142",
      "169342": "20001142",
      "169346": "20001142",
      "169347": "20001142",
      "169348": "20001142",
      "169352": "20001142",
      "169353": "20001142",
      "169354": "20001142",
      "169370": "20001139",
      "169371": "20001139",
      "162955": "20001137",
      "162956": "20001139",
      "162957": "20001139",
      "162958": "20001139",
      "162959": "20001139",
      "162960": "20001139",
      "162961": "20001142",
      "162962": "20001142",
      "162963": "20001142",
      "162964": "20001142",
      "162965": "20001137",
      "162966": "20001139",
      "162967": "20001139",
      "162968": "20001139",
      "162969": "20001139",
      "162970": "20001139",
      "162971": "20001142",
      "162972": "20001142",
      "162973": "20001142",
      "162974": "20001142",
      "162975": "20001142",
      "162976": "20001142",
      "162977": "20001142",
      "162978": "20001142",
      "162979": "20001142",
      "162980": "20001142",
      "162981": "20001139",
      "162982": "20001139",
      "162983": "20001142",
      "162984": "20001142",
      "162985": "20001139",
      "162986": "20001142",
      "162841": "20001137",
      "169385": "20001139",
      "169386": "20001139",
      "169387": "20001139",
      "169388": "20001139",
      "169389": "20001139",
      "169390": "20001142",
      "169391": "20001142",
      "169392": "20001142",
      "169393": "20001139",
      "169394": "20001139",
      "169395": "20001139",
      "162843": "20001139",
      "169396": "20001139",
      "169397": "20001139",
      "162842": "20001142",
      "162845": "20001137",
      "169398": "20001139",
      "169399": "20001139",
      "169400": "20001139",
      "169401": "20001139",
      "169402": "20001139",
      "169403": "20001142",
      "169404": "20001142",
      "169405": "20001142",
      "169406": "20001139",
      "169407": "20001139",
      "169408": "20001139",
      "162847": "20001139",
      "169409": "20001139",
      "169410": "20001139",
      "162846": "20001142",
      "170856": "20001136",
      "170857": "20001136",
      "170429": "20001141",
      "170430": "20001141",
      "172090": "20001141",
      "172091": "20001141",
      "171862": "20001141",
      "171863": "20001141",
      "168025": "20001138",
      "168033": "20001138",
      "168026": "20001138",
      "168034": "20001138",
      "168024": "20001138",
      "168032": "20001138",
      "162710": "20001142",
      "162671": "20001142",
      "162662": "20001142",
      "162869": "20001142",
      "162715": "20001142",
      "162884": "20001142",
      "162895": "20001142",
      "162931": "20001142",
      "162812": "20001142",
      "162894": "20001142",
      "162830": "20001142",
      "162885": "20001142",
      "162917": "20001142",
      "162901": "20001142",
      "162915": "20001142",
      "162716": "20001142",
      "162887": "20001142",
      "162916": "20001142",
      "162938": "20001142",
      "163945": "20001142",
      "162813": "20001142",
      "162876": "20001142",
      "162897": "20001142",
      "162907": "20001142",
      "162913": "20001142",
      "162711": "20001142",
      "162918": "20001142",
      "162926": "20001142",
      "162719": "20001142",
      "162875": "20001142",
      "162888": "20001142",
      "162714": "20001142",
      "162828": "20001142",
      "162873": "20001142",
      "162937": "20001142",
      "162908": "20001142",
      "162914": "20001142",
      "162912": "20001142",
      "162928": "20001142",
      "162909": "20001142",
      "162934": "20001142",
      "162921": "20001142",
      "162717": "20001142",
      "163944": "20001142",
      "162893": "20001142",
      "162871": "20001142",
      "162896": "20001142",
      "162936": "20001142",
      "165089": "20001142",
      "162826": "20001142",
      "162892": "20001142",
      "162939": "20001142",
      "162924": "20001142",
      "162880": "20001142",
      "162874": "20001142",
      "162881": "20001142",
      "162882": "20001142",
      "162940": "20001142",
      "162943": "20001142",
      "162690": "20001142",
      "162829": "20001142",
      "162831": "20001142",
      "161931": "20001142",
      "162718": "20001142",
      "162866": "20001142",
      "162878": "20001142",
      "162720": "20001142",
      "162832": "20001142",
      "162877": "20001142",
      "162889": "20001142",
      "162890": "20001142",
      "165090": "20001142",
      "162905": "20001142",
      "162910": "20001142",
      "162919": "20001142",
      "162923": "20001142",
      "162824": "20001142",
      "162870": "20001142",
      "162927": "20001142",
      "162935": "20001142",
      "162809": "20001142",
      "162811": "20001142",
      "162883": "20001142",
      "162721": "20001142",
      "162942": "20001142",
      "162944": "20001142",
      "162902": "20001142",
      "162903": "20001142",
      "162879": "20001142",
      "165087": "20001142",
      "162925": "20001142",
      "162932": "20001142",
      "162825": "20001142",
      "162886": "20001142",
      "162920": "20001142",
      "162930": "20001142",
      "162872": "20001142",
      "162899": "20001142",
      "162900": "20001142",
      "165088": "20001142",
      "162911": "20001142",
      "162929": "20001142",
      "162933": "20001142",
      "162810": "20001142",
      "162922": "20001142",
      "162898": "20001142",
      "162906": "20001142",
      "162891": "20001142",
      "162941": "20001142",
      "162712": "20001142",
      "162867": "20001142",
      "172135": "20001145",
      "167618": "20001145",
      "170533": "20001145",
      "160206": "20001145",
      "170534": "20001145",
      "170532": "20001145",
      "160319": "20001145",
      "160320": "20001145",
      "160321": "20001145",
      "160322": "20001145",
      "163007": "20001145",
      "160323": "20001145",
      "160324": "20001145",
      "160325": "20001145",
      "160326": "20001145"
    };

    // Defaults
    let salescode = '20001139';
    let clearlinkeventid = '';

    function rebuildBuyflowUrl(values) {
      return `https://shop.brightspeed.com/uas/?utm_medium=DAP&utm_source=Clearlink&affprog=clearlink&welcomeBack=welcome-back&salescode=${values.salescode}&cookietime=30day${
        values.clearlinkeventid ? `&acsid=${values.clearlinkeventid}` : ''
      }`;
    }

    function extractValuesFromMapi(parsedData, maybeEventRequestId) {
      const extracted = {
        salescode,
        clearlinkeventid,
      };

      if (maybeEventRequestId) extracted.clearlinkeventid = String(maybeEventRequestId);

      if (!parsedData) return extracted;

      // request id
      if (!extracted.clearlinkeventid) {
        extracted.clearlinkeventid =
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
        if (promoToSalesCodeMap[promoStr]) extracted.salescode = promoToSalesCodeMap[promoStr];
      }

      return extracted;
    }

    try {
      const parsedData =
        parsedMapiData ||
        (() => {
          const mapiData = localStorage.getItem('mapi');
          return mapiData ? JSON.parse(mapiData) : null;
        })();

      const extracted = extractValuesFromMapi(parsedData, eventRequestId);
      salescode = extracted.salescode;
      clearlinkeventid = extracted.clearlinkeventid;
    } catch (e) {
      warn('Error extracting data from mapi', e);
    }

    // Build URL (keep params exactly as v4)
    let buyflowUrl = rebuildBuyflowUrl({ salescode, clearlinkeventid });

    function hasAnyBspMarks() {
      return document.querySelector('[data-bsp-injected="1"], [data-bsp-updated="1"]') != null;
    }

    // Process inside hero content per scenarios (unchanged logic/style)
    function processScopedLinks(url) {
      const heroEl = document.querySelector('.leshen-hero') || document.querySelector('.leshen-billboard');
      if (!heroEl) return;
      const content = heroEl.querySelector('.content');
      if (!content) return;

      // If we find an <input>, do nothing
      if (content.querySelector('input')) return;

      function updateExistingCtaIfPresent() {
        // Prevent double-CTA: if the page already has a native CTA ("cobra"),
        // prefer updating it instead of injecting a second CTA.
        const candidates = Array.from(content.querySelectorAll('a.leshen-link-button-wrapper'));
        if (candidates.length === 0) return false;

        // If we already injected our CTA, nothing to do here.
        if (content.querySelector('a.leshen-link-button-wrapper[data-bsp-injected="1"]')) return true;

        // Prefer a non-tel CTA (the existing "switch/cart" style CTA), otherwise take the first.
        const pick =
          candidates.find((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            return href && !href.startsWith('tel:');
          }) || candidates[0];

        try {
          pick.href = url;
          pick.dataset.bspUpdated = '1';
          return true;
        } catch (e) {
          return true; // CTA exists, but we couldn't set href; still skip injection
        }
      }

      const telAnchor = content.querySelector('a[href^="tel:"]');
      const cartAnchor = content.querySelector('a[href*="/cart"]');

      // If both exist: update only the /cart link
      if (telAnchor && cartAnchor) {
        try {
          cartAnchor.href = url;
          cartAnchor.dataset.bspUpdated = '1';
        } catch (e) {
          // ignore
        }
        return;
      }

      // If only tel exists: insert button
      if (telAnchor && !cartAnchor) {
        // Avoid duplicating if already injected
        const existing = content.querySelector('a.leshen-link-button-wrapper[data-bsp-injected="1"]');
        if (existing) {
          try {
            if (existing.href !== url) existing.href = url;
          } catch (e) {
            // ignore
          }
          return;
        }

        // Apply button styling to the button inside the telephone link (unchanged)
        try {
          const telButton = telAnchor.querySelector('button');
          if (telButton) {
            telButton.style.cssText = `
              padding-top: 8px !important;
              padding-bottom: 8px !important;
              padding-left: 16px !important;
              padding-right: 16px !important;
              box-shadow: none !important;
              margin-top: 1rem !important;
              position: relative !important;
              z-index: 9999 !important;
              pointer-events: auto !important;
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              border: 2px solid #000000 !important;
              color: #000000 !important;
              background: #fff !important;
              border-radius: 2em !important;
              cursor: pointer !important;
            `;
          }
        } catch (e) {
          // ignore
        }

        const buttonId = 'bsp-injected-button-' + Math.floor(Math.random() * 10000);
        const newButtonHtml = `
        <a id="${buttonId}" class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 bsp-cart-link" href="${url}" data-bsp-injected="1" visibility="All devices" style="
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
            telAnchor.insertAdjacentHTML('beforebegin', newButtonHtml);
          } catch (innerError) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newButtonHtml;
            const buttonElement = tempDiv.firstElementChild;
            telAnchor.parentNode.insertBefore(buttonElement, telAnchor);
          }
          protectInjectedElements();
        } catch (e) {
          // ignore
        }
        return;
      }

      // If only /cart exists (no tel): update it
      if (!telAnchor && cartAnchor) {
        try {
          cartAnchor.href = url;
          cartAnchor.dataset.bspUpdated = '1';
        } catch (e) {
          // ignore
        }
      }

      // If no tel or cart links found, insert button below last .leshen-typography-body (unchanged style)
      if (!telAnchor && !cartAnchor) {
        // NEW: if an existing CTA is present (e.g. cobra), update it and do not inject another.
        if (updateExistingCtaIfPresent()) return;

        const typographyElements = content.querySelectorAll('.leshen-typography-body');
        if (typographyElements.length === 0) return;

        if (content.querySelector('a.leshen-link-button-wrapper[data-bsp-injected="1"]')) return;

        const lastTypographyElement = typographyElements[typographyElements.length - 1];
        let targetElement = lastTypographyElement;
        let nextElement = lastTypographyElement.nextElementSibling;
        let foundList = false;

        while (nextElement) {
          if (nextElement.classList.contains('leshen-list')) {
            targetElement = nextElement;
            foundList = true;
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }

        const buttonId = 'bsp-injected-button-' + Math.floor(Math.random() * 10000);
        const newButtonHtml = `
        <a id="${buttonId}" class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 bsp-cart-link" href="${url}" data-bsp-injected="1" visibility="All devices" style="
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            margin-top: 1.5rem !important;
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
                background-color: #FFC800 !important;
                border: 0 !important;
                border-radius: 2em !important;
                cursor: pointer !important;
                -webkit-transition: all 0.3s !important;
                transition: all 0.3s !important;
                -webkit-appearance: button !important;
                box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.1) !important;
                position: relative !important;
                z-index: 9999 !important;
                pointer-events: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
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
          targetElement.insertAdjacentHTML('afterend', newButtonHtml);
          protectInjectedElements();
          // silence unused var warning in some environments
          void foundList;
        } catch (e) {
          try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newButtonHtml;
            const buttonElement = tempDiv.firstElementChild;
            content.appendChild(buttonElement);
            protectInjectedElements();
          } catch (e2) {
            // ignore
          }
        }
      }
    }

    function processAllCartLinks(url) {
      const allCartLinks = document.querySelectorAll('a[href="/cart"], a[href*="/cart"]');
      if (allCartLinks.length === 0) return;

      allCartLinks.forEach((link) => {
        try {
          if (link.dataset.bspUpdated === '1') return;
          link.href = url;
          link.dataset.bspUpdated = '1';
        } catch (e) {
          // ignore
        }
      });
    }

    // Ensure logic: React can render hero later; keep trying briefly.
    let ensureTimerId = null;
    function ensureApplied(url, { maxMs = 15000, intervalMs = 250 } = {}) {
      if (hasAnyBspMarks()) return;
      if (ensureTimerId) return;

      const startedAt = Date.now();
      ensureTimerId = setInterval(() => {
        if (hasAnyBspMarks()) {
          clearInterval(ensureTimerId);
          ensureTimerId = null;
          return;
        }
        if (Date.now() - startedAt > maxMs) {
          clearInterval(ensureTimerId);
          ensureTimerId = null;
          return;
        }
        processScopedLinks(url);
        processAllCartLinks(url);
      }, intervalMs);
    }

    // Add a global verification flag to track successful URL modifications
    window.bspCartButtonFinderSuccess = false;

    processScopedLinks(buyflowUrl);
    processAllCartLinks(buyflowUrl);
    ensureApplied(buyflowUrl);

    // Mark success if anything is present
    if (hasAnyBspMarks()) window.bspCartButtonFinderSuccess = true;

    // Function to protect injected elements from removal (kept from v4)
    function protectInjectedElements() {
      const injectedElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');

      injectedElements.forEach((element) => {
        try {
          element.remove = function () {
            return false;
          };
        } catch (e) {
          // ignore
        }

        try {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function (name, value) {
            if (
              name === 'style' &&
              (String(value).includes('display: none') ||
                String(value).includes('visibility: hidden') ||
                String(value).includes('opacity: 0'))
            ) {
              return false;
            }
            return originalSetAttribute.call(this, name, value);
          };
        } catch (e) {
          // ignore
        }
      });
    }

    // MutationObserver: re-apply on React DOM churn (and also when new nodes are added).
    function setupMutationObserver(url) {
      const observer = new MutationObserver((mutations) => {
        let needToReapply = false;
        let shouldEnsure = false;

        for (const mutation of mutations) {
          if (mutation.addedNodes && mutation.addedNodes.length) shouldEnsure = true;
          if (mutation.removedNodes && mutation.removedNodes.length) {
            for (const node of mutation.removedNodes) {
              if (node && node.nodeType === 1) {
                if (
                  (node.dataset && (node.dataset.bspInjected === '1' || node.dataset.bspUpdated === '1')) ||
                  (node.querySelector &&
                    node.querySelector('[data-bsp-injected="1"], [data-bsp-updated="1"]'))
                ) {
                  needToReapply = true;
                  break;
                }
              }
            }
          }
          if (needToReapply) break;
        }

        if (needToReapply) {
          setTimeout(() => {
            processScopedLinks(url);
            processAllCartLinks(url);
            ensureApplied(url);
            if (hasAnyBspMarks()) window.bspCartButtonFinderSuccess = true;
          }, 0);
        } else if (shouldEnsure) {
          ensureApplied(url);
        }
      });

      try {
        const target = document.querySelector('main') || document.body;
        if (target) observer.observe(target, { childList: true, subtree: true });
      } catch (e) {
        // ignore
      }

      ensureApplied(url);

      // Short periodic fallback (avoid v4’s long-running overhead)
      const startedAt = Date.now();
      const maxFallbackMs = 30000;
      const intervalId = setInterval(() => {
        if (window.bspCartButtonFinderSuccess) {
          clearInterval(intervalId);
          return;
        }
        if (Date.now() - startedAt > maxFallbackMs) {
          clearInterval(intervalId);
          return;
        }
        if (!hasAnyBspMarks()) {
          processScopedLinks(url);
          processAllCartLinks(url);
          ensureApplied(url);
          if (hasAnyBspMarks()) window.bspCartButtonFinderSuccess = true;
        }
      }, 1500);
    }

    setupMutationObserver(buyflowUrl);

    function runOnceAfterLoad(fn) {
      if (document.readyState === 'complete') {
        fn();
        return;
      }
      window.addEventListener('load', fn, { once: true });
    }

    runOnceAfterLoad(function () {
      const updatedValues = (() => {
        try {
          const mapiData = localStorage.getItem('mapi');
          if (!mapiData) return { salescode, clearlinkeventid };
          const parsedData = JSON.parse(mapiData);
          return extractValuesFromMapi(parsedData, null);
        } catch (e) {
          return { salescode, clearlinkeventid };
        }
      })();

      const nextUrl = rebuildBuyflowUrl(updatedValues);
      if (nextUrl !== buyflowUrl) {
        salescode = updatedValues.salescode || salescode;
        clearlinkeventid = updatedValues.clearlinkeventid || clearlinkeventid;
        buyflowUrl = nextUrl;
        processScopedLinks(buyflowUrl);
        processAllCartLinks(buyflowUrl);
        ensureApplied(buyflowUrl);
        if (hasAnyBspMarks()) window.bspCartButtonFinderSuccess = true;
      }
    });

    return {
      updateFromMapi(nextMapiData, nextEventRequestId) {
        try {
          const updatedValues = extractValuesFromMapi(nextMapiData, nextEventRequestId);
          salescode = updatedValues.salescode || salescode;
          clearlinkeventid = updatedValues.clearlinkeventid || clearlinkeventid;
          buyflowUrl = rebuildBuyflowUrl({ salescode, clearlinkeventid });

          processAllCartLinks(buyflowUrl);
          // update in-scope link href or ensure injection without flicker
          processScopedLinks(buyflowUrl);
          ensureApplied(buyflowUrl);

          if (hasAnyBspMarks()) window.bspCartButtonFinderSuccess = true;
        } catch (e) {
          warn('updateFromMapi failed', e);
        }
      },
    };
  }
})();

