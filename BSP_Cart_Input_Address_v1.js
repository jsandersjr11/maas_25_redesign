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
  
      // --- Address qualification config (override via window.__BSP_ADDRESS_QUAL_CONFIG) ---
      const ADDRESS_QUAL_CONFIG = Object.assign(
        {
          affprog: 'clearlink',
          custType: 'both',
          cookietime: 'session',
          // Radar Autocomplete (UI suggestions only)
          radarPublishableKey: 'prj_live_pk_d3a1113fc5c543c5fcd05f707d094fa5471b359d',
          radarVersion: 'v4.5.3',
          radarCountryCode: 'US',
          // Debounce for API calls
          debounceMs: 180,
          // Max suggestions to render
          maxSuggestions: 6,
        },
        (window && window.__BSP_ADDRESS_QUAL_CONFIG) || {}
      );

      function loadRadarSdk() {
        return new Promise((resolve, reject) => {
          if (window.Radar) return resolve();

          const version = ADDRESS_QUAL_CONFIG.radarVersion || 'v4.5.3';

          try {
            if (!document.getElementById('bsp-radar-css')) {
              const css = document.createElement('link');
              css.id = 'bsp-radar-css';
              css.rel = 'stylesheet';
              css.href = `https://js.radar.com/${version}/radar.css`;
              document.head.appendChild(css);
            }
          } catch (e) {
            // ignore
          }

          const s = document.createElement('script');
          s.async = true;
          s.src = `https://js.radar.com/${version}/radar.min.js`;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Radar SDK'));
          document.head.appendChild(s);
        });
      }

      function getOrCreateSessionId() {
        const key = 'bsp_acsid';
        try {
          const existing = sessionStorage.getItem(key);
          if (existing) return existing;
          const id =
            (window.crypto && typeof window.crypto.randomUUID === 'function' && window.crypto.randomUUID()) ||
            `bsp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
          sessionStorage.setItem(key, id);
          return id;
        } catch (e) {
          return (
            (window.crypto && typeof window.crypto.randomUUID === 'function' && window.crypto.randomUUID()) ||
            `bsp_${Date.now()}_${Math.random().toString(16).slice(2)}`
          );
        }
      }

      function htmlEncode(str) {
        // NOTE: Brightspeed's docs/examples use plain percent-encoding (not HTML entities)
        // for `acfulladdress`. This helper remains for legacy but is no longer used for
        // `acfulladdress` in the redirect.
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function formatAmsAddressFromRadarSelection(sel) {
        // AMS target format:
        // Brightspeed docs example:
        // "3356 19th St S, Fargo, ND 58104-6550"
        // Some Brightspeed builds parse `acfulladdress` by splitting on commas and
        // expect exactly 4 elements: street, city, state, zip.
        // So we send: "{streetLine}, {city}, {state}, {zip}"
        //
        // CRITICAL: do NOT use Radar's addressLabel/formattedAddress as the street line,
        // because it can include commas/city/state/zip which breaks Brightspeed parsing.
        // (ZIP+4 not always available via Radar)
        const number = (sel && sel.number) || '';
        const street = (sel && sel.street) || '';
        const unit = (sel && (sel.unit || sel.unitNumber || sel.secondary)) || '';
        const streetLine = `${number ? `${number} ` : ''}${street}${unit ? ` ${unit}` : ''}`.trim();

        const city = (sel && sel.city) || '';
        const state = (sel && (sel.stateCode || sel.state)) || '';
        const zip = (sel && sel.postalCode) || '';
        // Preferred: STREET, CITY, ST, ZIP
        // Fallback if city/state/zip missing: just return streetLine.
        const full = city && state && zip ? `${streetLine}, ${city}, ${state}, ${zip}` : streetLine;
        return full.replace(/\s+/g, ' ').trim();
      }

      function rebuildBuyflowUrl({ salescode, acsid, htmlEncodedFullAddress }) {
        const base = 'https://shop.brightspeed.com/uas/';
        // IMPORTANT: Brightspeed doc examples use `%20` for spaces (not `+`).
        // URLSearchParams serializes spaces as `+`, which may not be decoded by their parser.
        const enc = (v) => encodeURIComponent(String(v == null ? '' : v));
        const parts = [
          `affprog=${enc(ADDRESS_QUAL_CONFIG.affprog)}`,
          `salescode=${enc(salescode || '')}`,
          `custType=${enc(ADDRESS_QUAL_CONFIG.custType)}`,
          `cookietime=${enc(ADDRESS_QUAL_CONFIG.cookietime)}`,
          `acsid=${enc(acsid || getOrCreateSessionId())}`,
          `acfulladdress=${enc(htmlEncodedFullAddress || '')}`,
        ];
        return `${base}?${parts.join('&')}`;
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
      let buyflowUrl = rebuildBuyflowUrl({ salescode, acsid: clearlinkeventid, htmlEncodedFullAddress: '' });
  
      function hasAnyBspMarks() {
        return (
          document.querySelector('[data-bsp-injected="1"], [data-bsp-updated="1"], [data-bsp-address-qual="1"]') != null
        );
      }
  
      // Process inside hero content per scenarios (unchanged logic/style)
      function processScopedLinks(url) {
        const heroEl = document.querySelector('.leshen-hero') || document.querySelector('.leshen-billboard');
        if (!heroEl) return;
        const content = heroEl.querySelector('.content');
        if (!content) return;
  
        // Install a global CAPTURE handler to win the race against
        // brightspeedplans.com delegated click navigation.
        // We only intercept clicks on OUR submit button.
        try {
          if (!window.__bspAddressQualSubmitCaptureInstalled) {
            window.__bspAddressQualSubmitCaptureInstalled = true;
            window.__bspAddressQualHandlers = window.__bspAddressQualHandlers || Object.create(null);
            document.addEventListener(
              'click',
              (e) => {
                try {
                  const t = e && e.target;
                  if (!t || !t.closest) return;
                  const btn = t.closest('button.bsp-address-qual-submit');
                  if (!btn) return;
                  const wrapEl = btn.closest('[data-bsp-address-qual="1"]');
                  if (!wrapEl) return;
                  const id = wrapEl.getAttribute('data-bsp-address-qual-id') || '';
                  const fn = id && window.__bspAddressQualHandlers && window.__bspAddressQualHandlers[id];
                  if (typeof fn !== 'function') return;

                  // Stop page navigation handlers, then run our submit.
                  e.preventDefault();
                  e.stopPropagation();
                  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
                  fn();
                } catch (e2) {
                  // ignore
                }
              },
              true
            );
          }
        } catch (e) {
          // ignore
        }

        // If we already injected our address input, nothing to do.
        if (content.querySelector('[data-bsp-address-qual="1"]')) return;

        // Remove any previously injected CTA button from older versions of this script.
        try {
          content
            .querySelectorAll('a.leshen-link-button-wrapper[data-bsp-injected="1"], a.bsp-cart-link[data-bsp-injected="1"]')
            .forEach((el) => el && el.remove && el.remove());
        } catch (e) {
          // ignore
        }

        // Add widget styles once
        try {
          if (!document.getElementById('bsp-address-qual-style')) {
            const style = document.createElement('style');
            style.id = 'bsp-address-qual-style';
            style.textContent = `
              .bsp-address-qual-wrap{margin-top:1.25rem!important;margin-bottom:1.25rem!important;position:relative!important;z-index:9999!important;pointer-events:auto!important}
              .bsp-address-qual-label{display:block!important;margin:0 0 .5rem 0!important;font-weight:600!important;color:#000!important}
              .bsp-address-qual-actions{margin-top:.85rem!important;display:flex!important;gap:.75rem!important;align-items:center!important;flex-wrap:wrap!important}
              .bsp-address-qual-submit{display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:12px 20px!important;font:inherit!important;color:#000!important;background-color:#FFC800!important;border:0!important;border-radius:999px!important;cursor:pointer!important;box-shadow:0 0.3rem 1rem 0 rgba(0, 0, 0, 0.1)!important}
              .bsp-address-qual-submit:disabled{opacity:.6!important;cursor:not-allowed!important}
              .bsp-address-qual-status{font-size:12px!important;color:#1b5e20!important;font-weight:600!important}
              .bsp-address-qual-error{font-size:12px!important;color:#b00020!important;display:none!important}
              .bsp-address-qual-note{margin:.5rem 0 0 0!important;font-size:12px!important;opacity:.75!important}
              /* Tweak Radar widget to match pill input */
              .bsp-address-qual-wrap .radar-autocomplete-input{width:100%!important;max-width:520px!important;padding:12px 14px!important;border:2px solid rgba(0,0,0,.25)!important;border-radius:999px!important;outline:none!important;font:inherit!important}
              .bsp-address-qual-wrap .radar-autocomplete-input:focus{border-color:#000!important;box-shadow:0 0 0 3px rgba(0,0,0,.08)!important}
              .bsp-address-qual-wrap .radar-autocomplete-results{max-width:520px!important;z-index:10000!important;border-radius:12px!important;overflow:hidden!important}
            `;
            document.head.appendChild(style);
          }
        } catch (e) {
          // ignore
        }

        const wrap = document.createElement('div');
        wrap.className = 'bsp-address-qual-wrap';
        wrap.dataset.bspAddressQual = '1';
        wrap.setAttribute('data-bsp-address-qual', '1');

        const label = document.createElement('label');
        label.className = 'bsp-address-qual-label';
        label.textContent = 'Enter your address to check availability';

        const widgetId = `bsp-radar-autocomplete-${Math.floor(Math.random() * 1e9)}`;
        wrap.setAttribute('data-bsp-address-qual-id', widgetId);
        const widgetContainer = document.createElement('div');
        widgetContainer.id = widgetId;
        widgetContainer.style.maxWidth = '520px';

        const note = document.createElement('div');
        note.className = 'bsp-address-qual-note';
        note.textContent = 'Select your address from the list to continue.';

        const actions = document.createElement('div');
        actions.className = 'bsp-address-qual-actions';

        const submitBtn = document.createElement('button');
        submitBtn.type = 'button';
        submitBtn.className = 'bsp-address-qual-submit';
        submitBtn.textContent = 'Check Availability';

        const status = document.createElement('div');
        status.className = 'bsp-address-qual-status';
        status.textContent = '';

        const err = document.createElement('div');
        err.className = 'bsp-address-qual-error';
        err.textContent = 'Please select a valid address from the suggestions.';

        actions.appendChild(submitBtn);
        actions.appendChild(status);
        actions.appendChild(err);

        wrap.appendChild(label);
        wrap.appendChild(widgetContainer);
        wrap.appendChild(actions);
        wrap.appendChild(note);

        // Insert near existing CTAs if present, else append to content.
        const telAnchor = content.querySelector('a[href^="tel:"]');
        const anyButtonWrapper = content.querySelector('a.leshen-link-button-wrapper');
        try {
          if (anyButtonWrapper && anyButtonWrapper.parentNode) anyButtonWrapper.parentNode.insertBefore(wrap, anyButtonWrapper);
          else if (telAnchor && telAnchor.parentNode) telAnchor.parentNode.insertBefore(wrap, telAnchor);
          else content.appendChild(wrap);
        } catch (e) {
          try {
            content.appendChild(wrap);
          } catch (e2) {
            // ignore
          }
        }

        let selectedRadarAddress = null;

        function redirectWithSelectedAddress(selection) {
          const amsFullAddress = formatAmsAddressFromRadarSelection(selection);
          const acsid = clearlinkeventid || getOrCreateSessionId();
          const redirectUrl = rebuildBuyflowUrl({
            salescode,
            acsid,
            // URLSearchParams will percent-encode; do not pre-encode or we'll double-encode.
            htmlEncodedFullAddress: amsFullAddress,
          });
          const w = window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          // IMPORTANT: do not fall back to same-tab navigation.
          if (!w) {
            err.textContent = 'Please allow popups to continue.';
            err.style.display = 'block';
          }
        }

        // Register a handler for the document-level capture submit.
        try {
          window.__bspAddressQualHandlers = window.__bspAddressQualHandlers || Object.create(null);
          window.__bspAddressQualHandlers[widgetId] = function () {
            if (!selectedRadarAddress) {
              err.style.display = 'block';
              return;
            }
            err.style.display = 'none';
            redirectWithSelectedAddress(selectedRadarAddress);
          };
        } catch (e) {
          // ignore
        }

        // Extra guard: prevent any parent click navigation when interacting with the widget.
        // IMPORTANT: do NOT use capture here, or it can block the submit button click handler.
        wrap.addEventListener('click', (e) => {
          try {
            e.stopPropagation();
          } catch (e2) {
            // ignore
          }
        });

        // Initialize Radar UI widget
        (async () => {
          try {
            const key = ADDRESS_QUAL_CONFIG.radarPublishableKey;
            if (!key) {
              err.textContent = 'Radar key missing. Set window.__BSP_ADDRESS_QUAL_CONFIG.radarPublishableKey';
              err.style.display = 'block';
              submitBtn.disabled = true;
              return;
            }

            await loadRadarSdk();
            if (!window.Radar || !window.Radar.ui || !window.Radar.ui.autocomplete) {
              err.textContent = 'Radar failed to load on this page.';
              err.style.display = 'block';
              submitBtn.disabled = true;
              return;
            }

            try {
              if (!window.__bspRadarInitialized) {
                window.Radar.initialize(key);
                window.__bspRadarInitialized = true;
              }
            } catch (e) {
              // ignore
            }

            window.Radar.ui.autocomplete({
              container: widgetId,
              responsive: true,
              placeholder: 'Start typing your street address…',
              countryCode: ADDRESS_QUAL_CONFIG.radarCountryCode || 'US',
              layers: ['address'],
              limit: Math.max(ADDRESS_QUAL_CONFIG.maxSuggestions || 6, 6),
              minCharacters: 3,
              onSelection: (address) => {
                selectedRadarAddress = address || null;
                err.style.display = 'none';
                status.textContent = selectedRadarAddress ? 'Address selected' : '';
              },
              onError: () => {
                err.textContent = 'Autocomplete error. Please try again.';
                err.style.display = 'block';
                status.textContent = '';
              },
            });
          } catch (e) {
            err.textContent = 'Autocomplete unavailable on this page.';
            err.style.display = 'block';
            submitBtn.disabled = true;
          }
        })();
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
  
        const nextUrl = rebuildBuyflowUrl({
          salescode: updatedValues.salescode || salescode,
          acsid: updatedValues.clearlinkeventid || clearlinkeventid,
          htmlEncodedFullAddress: '',
        });
        if (nextUrl !== buyflowUrl) {
          salescode = updatedValues.salescode || salescode;
          clearlinkeventid = updatedValues.clearlinkeventid || clearlinkeventid;
          buyflowUrl = rebuildBuyflowUrl({ salescode, acsid: clearlinkeventid, htmlEncodedFullAddress: '' });
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
            buyflowUrl = rebuildBuyflowUrl({ salescode, acsid: clearlinkeventid, htmlEncodedFullAddress: '' });
  
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
  
  