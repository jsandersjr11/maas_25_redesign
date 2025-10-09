(function () {
   console.log('[BSP Cart Button Finder] Script initialized');

   // Fallback init in case event never fires
   let scriptInitialized = false;
   const fallbackTimeout = setTimeout(() => {
     if (!scriptInitialized) {
       console.log('[BSP Cart Button Finder] Fallback timeout reached. Initializing script anyway.');
       initializeMainScript();
     }
   }, 30000);

   // Listen for the mapiRequestIdReady event
   document.addEventListener('mapiRequestIdReady', (e) => {
     console.log('[BSP Cart Button Finder] mapiRequestIdReady event received');
     const requestId = e?.detail?.requestId;
     console.log('[BSP Cart Button Finder] Request ID from event:', requestId);

     if (requestId && !scriptInitialized) {
       scriptInitialized = true;
       clearTimeout(fallbackTimeout);

       try {
         const mapiData = localStorage.getItem('mapi');
         if (mapiData) {
           const parsedData = JSON.parse(mapiData);
           console.log('[BSP Cart Button Finder] MAPI data found in localStorage');
           initializeMainScript(parsedData, requestId);
         } else {
           console.log('[BSP Cart Button Finder] No MAPI data in localStorage, using event data only');
           const minimalData = { requestId };
           initializeMainScript(minimalData, requestId);
         }
       } catch (error) {
         console.error('[BSP Cart Button Finder] Error processing MAPI data:', error);
         const minimalData = { requestId };
         initializeMainScript(minimalData, requestId);
       }
     } else if (!requestId) {
       console.log('[BSP Cart Button Finder] Event received but no requestId found in event details');
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
         console.log('[BSP Cart Button Finder] MAPI data already exists in localStorage with requestId');
         scriptInitialized = true;
         clearTimeout(fallbackTimeout);
         initializeMainScript(parsedData);
       }
     }
   } catch (error) {
     console.error('[BSP Cart Button Finder] Error checking initial localStorage:', error);
   }

   function initializeMainScript(parsedMapiData = null, eventRequestId = null) {
     console.log('[BSP Cart Button Finder] Initializing main script');

     // Define the promo code to sales code mapping (updated from CSV data)
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

     try {
       if (eventRequestId) {
         clearlinkeventid = eventRequestId;
         console.log('[BSP Cart Button Finder] Using requestId from event:', clearlinkeventid);
       }

       const parsedData =
         parsedMapiData ||
         (() => {
           const mapiData = localStorage.getItem('mapi');
           return mapiData ? JSON.parse(mapiData) : null;
         })();

       if (parsedData) {
         // Log the MAPI data structure for debugging
         console.log('[BSP Cart Button Finder] MAPI data structure found');
         console.log('[BSP Cart Button Finder] Root level keys:', Object.keys(parsedData));
         
         // Extract request_id - check all possible locations if we don't already have it from the event
         if (!clearlinkeventid) {
           if (parsedData.requestId) {
             clearlinkeventid = parsedData.requestId;
             console.log('[BSP Cart Button Finder] Extracted requestId (ACSID) from root level:', clearlinkeventid);
           } else if (parsedData.requestData && parsedData.requestData.requestId) {
             clearlinkeventid = parsedData.requestData.requestId;
             console.log('[BSP Cart Button Finder] Extracted requestId (ACSID) from requestData:', clearlinkeventid);
           } else if (
             parsedData.requestData &&
             parsedData.requestData.fullResponse &&
             parsedData.requestData.fullResponse.data &&
             parsedData.requestData.fullResponse.data.request_id
           ) {
             clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
             console.log('[BSP Cart Button Finder] Extracted request_id (ACSID) from fullResponse.data:', clearlinkeventid);
           } else {
             console.log('[BSP Cart Button Finder] Could not find request_id in any expected location');
             // Log available paths to help debug
             if (parsedData.requestData) {
               console.log('[BSP Cart Button Finder] requestData keys:', Object.keys(parsedData.requestData));
               if (parsedData.requestData.fullResponse) {
                 console.log('[BSP Cart Button Finder] fullResponse keys:', Object.keys(parsedData.requestData.fullResponse));
                 if (parsedData.requestData.fullResponse.data) {
                   console.log('[BSP Cart Button Finder] fullResponse.data keys:', Object.keys(parsedData.requestData.fullResponse.data));
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
           console.log('[BSP Cart Button Finder] Extracted promo_code from fullResponse.data:', promoCode);
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
           console.log('[BSP Cart Button Finder] Extracted promo_code from promo_data.data:', promoCode);
         }
         // Check other possible locations
         else if (parsedData.promo_code) {
           promoCode = parsedData.promo_code;
           console.log('[BSP Cart Button Finder] Extracted promo_code from root level:', promoCode);
         } else if (parsedData.lastPromo) {
           promoCode = parsedData.lastPromo;
           console.log('[BSP Cart Button Finder] Extracted lastPromo from root level:', promoCode);
         } else {
           console.log('[BSP Cart Button Finder] Could not find promo_code in any expected location');
           // Log available paths to help debug
           if (parsedData.requestData && parsedData.requestData.fullResponse && parsedData.requestData.fullResponse.data) {
             console.log('[BSP Cart Button Finder] Available properties in fullResponse.data:', 
                         Object.keys(parsedData.requestData.fullResponse.data));
             if (parsedData.requestData.fullResponse.data.promo_data) {
               console.log('[BSP Cart Button Finder] promo_data keys:', 
                           Object.keys(parsedData.requestData.fullResponse.data.promo_data));
             }
           }
         }

         if (promoCode) {
           // Convert to string to ensure proper lookup
           promoCode = String(promoCode);
           console.log('[BSP Cart Button Finder] Extracted promo_code:', promoCode);
           
           // Look up the sales code from the mapping
           if (promoToSalesCodeMap[promoCode]) {
             salescode = promoToSalesCodeMap[promoCode];
             console.log('[BSP Cart Button Finder] Mapped to sales code:', salescode);
           } else {
             console.log('[BSP Cart Button Finder] No mapping found for promo code:', promoCode, 'using default sales code:', salescode);
           }
         } else {
           console.log('[BSP Cart Button Finder] No promo_code found in mapi data, using default sales code:', salescode);
         }
       }
     } catch (error) {
       console.error('[BSP Cart Button Finder] Error extracting data from mapi:', error);
     }

     // Build URL
     let buyflowUrl = `https://shop.brightspeed.com/uas/?affprog=clearlink&salescode=${salescode}&cookietime=30day${
       clearlinkeventid ? `&acsid=${clearlinkeventid}` : ''
     }`;

     // Process inside <main> > first <section> > .content per scenarios
     function processScopedLinks(url) {
       const heroEl = document.querySelector('.leshen-hero');
       if (!heroEl) {
         console.log('[BSP Cart Button Finder] .leshen-hero not found');
         return;
       }
       const content = heroEl.querySelector(".content");
       if (!content) {
         console.log("[BSP Cart Button Finder] .content not found inside .leshen-hero");
         return;
       }

       // If we find an <input>, do nothing
       if (content.querySelector('input')) {
         console.log('[BSP Cart Button Finder] <input> found in scope; skipping');
         return;
       }

       const telAnchor = content.querySelector('a[href^="tel:"]');
       const cartAnchor = content.querySelector('a[href*="/cart"]');

       // If both exist: update only the /cart link
       if (telAnchor && cartAnchor) {
         try {
           cartAnchor.href = url;
           cartAnchor.dataset.bspUpdated = '1';
           console.log('[BSP Cart Button Finder] Updated existing /cart link in scope');
         } catch (e) {
           console.error('[BSP Cart Button Finder] Failed updating /cart link', e);
         }
         return;
       }

       // If only tel exists: append the button anchor like in BSP_Global_4_Responsive_Button.js
       if (telAnchor && !cartAnchor) {
         // Avoid duplicating if already injected
         if (content.querySelector('a.leshen-link-button-wrapper[data-bsp-injected="1"]')) {
           console.log('[BSP Cart Button Finder] Button already injected; skipping');
           return;
         }

         // Add a unique ID to make it easier to find and re-inject if removed
         const buttonId = 'bsp-injected-button-' + Math.floor(Math.random() * 10000);
         
         // Create a more resilient button that's harder to remove
         const newButtonHtml = `
         <a id="${buttonId}" class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 bsp-cart-link" href="${url}" data-bsp-injected="1" visibility="All devices" style="
             display: block !important;
             visibility: visible !important;
             opacity: 1 !important;
         ">
             <button class="leshen-link-button convert-link-button css-4o5p4y" color="dark" tabindex="0" type="button" style="
                 padding-top: 0.15rem;
                 padding-bottom: 0.15rem;
                 padding-left: 1rem;
                 padding-right: 1rem;
                 box-shadow: none;
                 margin-top: 1.5rem;
                 position: relative;
                 z-index: 9999 !important;
                 pointer-events: auto !important;
                 display: block !important;
                 visibility: visible !important;
                 opacity: 1 !important;
                 border: 2px solid #404040;
                 color: #404040;
                 background: #fff;
                 border-radius: 2em;
                  cursor: pointer;

             ">
                 <span class="button-text css-2qtueq e1hk20aw0" style="
                     font-weight: 500;
                     font-size: calc(0.5555555555555556vw + 0.5rem);
                     line-height: calc(1.1111111111111112vw + 0.75rem);
                     pointer-events: auto !important;
                     display: inline !important;
                     visibility: visible !important;
                     opacity: 1 !important;
                 ">Check availability</span>
             </button>
         </a>`;

         try {
           // Try multiple insertion methods to ensure the button gets added
           try {
             // Method 1: Standard insertion
             telAnchor.insertAdjacentHTML('afterend', newButtonHtml);
             console.log('[BSP Cart Button Finder] Injected buyflow button after tel: link');
           } catch (innerError) {
             console.warn('[BSP Cart Button Finder] Primary insertion method failed, trying alternative', innerError);
             
             // Method 2: Create element and append
             const tempDiv = document.createElement('div');
             tempDiv.innerHTML = newButtonHtml;
             const buttonElement = tempDiv.firstElementChild;
             telAnchor.parentNode.insertBefore(buttonElement, telAnchor.nextSibling);
             console.log('[BSP Cart Button Finder] Injected buyflow button using alternative method');
           }
           
           // Add protection against DOM manipulation
           protectInjectedElements();
         } catch (e) {
           console.error('[BSP Cart Button Finder] All insertion methods failed', e);
           
           // Last resort: Try to insert at the end of the section
           try {
             const parentSection = content.closest('section');
             if (parentSection) {
               const tempDiv = document.createElement('div');
               tempDiv.innerHTML = newButtonHtml;
               const buttonElement = tempDiv.firstElementChild;
               parentSection.appendChild(buttonElement);
               console.log('[BSP Cart Button Finder] Injected buyflow button at end of section as last resort');
               protectInjectedElements();
             }
           } catch (lastError) {
             console.error('[BSP Cart Button Finder] Even last resort insertion failed', lastError);
           }
         }
         return;
       }

       // If only /cart exists (no tel): update it
       if (!telAnchor && cartAnchor) {
         try {
           cartAnchor.href = url;
           cartAnchor.dataset.bspUpdated = '1';
           console.log('[BSP Cart Button Finder] Updated /cart link (no tel present)');
         } catch (e) {
           console.error('[BSP Cart Button Finder] Failed updating /cart link (no tel)', e);
         }
       }
     }

     // Process all cart links on the entire page
     function processAllCartLinks(url) {
       console.log('[BSP Cart Button Finder] Searching for all cart links on the page');
       // Updated selector to catch both href="/cart" exactly and href containing "/cart"
       const allCartLinks = document.querySelectorAll('a[href="/cart"], a[href*="/cart"]');
       
       if (allCartLinks.length === 0) {
         console.log('[BSP Cart Button Finder] No cart links found on the page');
         return;
       }
       
       console.log(`[BSP Cart Button Finder] Found ${allCartLinks.length} cart links on the page`);
       
       allCartLinks.forEach((link, index) => {
         try {
           // Skip links that were already processed by processScopedLinks
           if (link.dataset.bspUpdated === '1') {
             console.log(`[BSP Cart Button Finder] Skipping already updated cart link #${index + 1}`);
             return;
           }
           
           link.href = url;
           link.dataset.bspUpdated = '1';
           console.log(`[BSP Cart Button Finder] Updated cart link #${index + 1}`);
         } catch (e) {
           console.error(`[BSP Cart Button Finder] Failed updating cart link #${index + 1}`, e);
         }
       });
     }

     // Initial values snapshot and initial apply
     const initialValues = { salescode, clearlinkeventid };
  
     // Add a global verification flag to track successful URL modifications
     window.bspCartButtonFinderSuccess = false;
  
     processScopedLinks(buyflowUrl);
     processAllCartLinks(buyflowUrl);
  
     // Check if initial application was successful
     const initialInjectedElements = document.querySelectorAll('[data-bsp-injected="1"]');
     const initialUpdatedElements = document.querySelectorAll('[data-bsp-updated="1"]');
  
     if (initialInjectedElements.length > 0 || initialUpdatedElements.length > 0) {
       console.log('[BSP Cart Button Finder] Initial URL modifications successful');
       window.bspCartButtonFinderSuccess = true;
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
           console.log(`[BSP Cart Button Finder] Scheduled re-injection check after ${delay}ms`);
          
          // If we've already verified success and elements are still present, don't reapply
          if (window.bspCartButtonFinderSuccess) {
            const currentElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
            if (currentElements.length > 0) {
              console.log('[BSP Cart Button Finder] URL modifications already verified successful, skipping re-injection');
              return;
            }
          }
          
          const injectedElements = document.querySelectorAll('[data-bsp-injected="1"]');
          const updatedElements = document.querySelectorAll('[data-bsp-updated="1"]');
          
          if (injectedElements.length === 0 || updatedElements.length === 0) {
            console.log('[BSP Cart Button Finder] Scheduled re-injection: Missing elements detected, re-applying');
            processScopedLinks(url);
            processAllCartLinks(url);
            
            // Check if this re-injection was successful
            setTimeout(() => {
              const newElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
              if (newElements.length > 0) {
                console.log('[BSP Cart Button Finder] Re-injection successful, marking as verified');
                window.bspCartButtonFinderSuccess = true;
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
          console.log('[BSP Cart Button Finder] Ending continuous checks after 5 minutes');
          return;
        }
        
        checkCount++;
        
        // If we've already verified success and elements are still present, don't reapply
        if (window.bspCartButtonFinderSuccess) {
          const currentElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
          if (currentElements.length > 0) {
            console.log('[BSP Cart Button Finder] Continuous check: URL modifications already verified successful, skipping');
            return;
          }
        }
        
        const injectedElements = document.querySelectorAll('[data-bsp-injected="1"]');
        const updatedElements = document.querySelectorAll('[data-bsp-updated="1"]');
        
        if (injectedElements.length === 0 || updatedElements.length === 0) {
          console.log('[BSP Cart Button Finder] Continuous check: Missing elements detected, re-applying');
          processScopedLinks(url);
          processAllCartLinks(url);
          
          // Check if this re-injection was successful
          setTimeout(() => {
            const newElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
            if (newElements.length > 0) {
              console.log('[BSP Cart Button Finder] Continuous check re-injection successful, marking as verified');
              window.bspCartButtonFinderSuccess = true;
            }
          }, 100);
        }
        
       }, 5000); // Check every 5 seconds
     }
     
     // Function to protect injected elements from removal
     function protectInjectedElements() {
       const injectedElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
       
       injectedElements.forEach(element => {
         // Make it harder to remove the element
         const originalRemove = element.remove;
         element.remove = function() {
           console.log('[BSP Cart Button Finder] Prevented removal of injected element');
           return false;
         };
         
         // Prevent style changes that would hide the element
         const originalSetAttribute = element.setAttribute;
         element.setAttribute = function(name, value) {
           if (name === 'style' && (value.includes('display: none') || value.includes('visibility: hidden') || value.includes('opacity: 0'))) {
             console.log('[BSP Cart Button Finder] Prevented style attribute change that would hide element');
             return false;
           }
           return originalSetAttribute.call(this, name, value);
         };
         
         // Prevent class changes that might hide the element
         const originalClassListAdd = element.classList.add;
         element.classList.add = function(className) {
           if (className.includes('hidden') || className.includes('invisible') || className.includes('removed')) {
             console.log('[BSP Cart Button Finder] Prevented adding class that might hide element:', className);
             return false;
           }
           return originalClassListAdd.call(this, className);
         };
       });
     }
     
     // Function to set up mutation observer to detect when our buttons are removed
     function setupMutationObserver(url) {
       console.log('[BSP Cart Button Finder] Setting up MutationObserver to monitor button removal');
       
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
                 if (node.dataset && node.dataset.bspInjected === '1' || node.dataset && node.dataset.bspUpdated === '1') {
                   console.log('[BSP Cart Button Finder] Detected removal of our injected/updated element');
                   needToReapply = true;
                   break;
                 }
                 
                 // Also check if any of the removed node's children had our data attribute
                 if (node.querySelector && node.querySelector('[data-bsp-injected="1"], [data-bsp-updated="1"]')) {
                   console.log('[BSP Cart Button Finder] Detected removal of a container with our injected/updated elements');
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
           if (window.bspCartButtonFinderSuccess) {
             console.log('[BSP Cart Button Finder] Elements removed but URL modifications already verified successful, skipping re-application');
           } else {
             console.log('[BSP Cart Button Finder] Re-applying button modifications after detected removal');
             setTimeout(() => {
               processScopedLinks(url);
               processAllCartLinks(url);
               
               // Check if this re-injection was successful
               setTimeout(() => {
                 const newElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
                 if (newElements.length > 0) {
                   console.log('[BSP Cart Button Finder] MutationObserver re-injection successful, marking as verified');
                   window.bspCartButtonFinderSuccess = true;
                 }
               }, 100);
             }, 100); // Small delay to ensure DOM is settled
           }
         }
       });
       
       // Also set up a periodic check as a fallback
       setInterval(() => {
         // If we've already verified success, skip the check
         if (window.bspCartButtonFinderSuccess) {
           return;
         }
        
         const injectedElements = document.querySelectorAll('[data-bsp-injected="1"]');
         const updatedElements = document.querySelectorAll('[data-bsp-updated="1"]');
         
         // If we expected elements to be there but they're not, reapply
         if ((injectedElements.length === 0 && updatedElements.length === 0)) {
           console.log('[BSP Cart Button Finder] Periodic check: No injected/updated elements found, re-applying');
           processScopedLinks(url);
           processAllCartLinks(url);
           
           // Check if this re-injection was successful
           setTimeout(() => {
             const newElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
             if (newElements.length > 0) {
               console.log('[BSP Cart Button Finder] Periodic check re-injection successful, marking as verified');
               window.bspCartButtonFinderSuccess = true;
             }
           }, 100);
         }
       }, 2000); // Check every 2 seconds
     }

     // Re-check on load
     window.addEventListener('load', function () {
       console.log('[BSP Cart Button Finder] Page fully loaded, checking mapi values again...');
       
       // If we've already verified success, skip the update
       if (window.bspCartButtonFinderSuccess) {
         console.log('[BSP Cart Button Finder] URL modifications already verified successful, skipping load-time update');
         return;
       }
       
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

       if (valuesChanged) {
         console.log('[BSP Cart Button Finder] Values changed after page load, updating button URLs...');
         buyflowUrl = `https://shop.brightspeed.com/uas/?affprog=clearlink&salescode=${updatedValues.salescode}&cookietime=30day${
           updatedValues.clearlinkeventid ? `&acsid=${updatedValues.clearlinkeventid}` : ''
         }`;
         processScopedLinks(buyflowUrl);
         processAllCartLinks(buyflowUrl);
         
         // Check if this update was successful
         setTimeout(() => {
           const newElements = document.querySelectorAll('[data-bsp-injected="1"], [data-bsp-updated="1"]');
           if (newElements.length > 0) {
             console.log('[BSP Cart Button Finder] Load-time update successful, marking as verified');
             window.bspCartButtonFinderSuccess = true;
           }
         }, 100);
       } else {
         console.log('[BSP Cart Button Finder] No changes to mapi values after page load');
       }
     });

     function extractMapiValues() {
       let extractedValues = {
         salescode: initialValues.salescode,
         clearlinkeventid: initialValues.clearlinkeventid,
         promoCode: null,
       };

       try {
         const mapiData = localStorage.getItem('mapi');
         if (mapiData) {
           const parsedData = JSON.parse(mapiData);

           console.log('[BSP Cart Button Finder] Re-extracting values from mapi data');
           
           // Extract request_id - check all possible locations
           if (parsedData.requestId) {
             extractedValues.clearlinkeventid = parsedData.requestId;
             console.log('[BSP Cart Button Finder] Found requestId at root level:', extractedValues.clearlinkeventid);
           } else if (parsedData.requestData && parsedData.requestData.requestId) {
             extractedValues.clearlinkeventid = parsedData.requestData.requestId;
             console.log('[BSP Cart Button Finder] Found requestId in requestData:', extractedValues.clearlinkeventid);
           } else if (
             parsedData.requestData &&
             parsedData.requestData.fullResponse &&
             parsedData.requestData.fullResponse.data &&
             parsedData.requestData.fullResponse.data.request_id
           ) {
             extractedValues.clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
             console.log('[BSP Cart Button Finder] Found request_id in fullResponse.data:', extractedValues.clearlinkeventid);
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
             console.log('[BSP Cart Button Finder] Found promo_code in fullResponse.data:', promoCode);
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
             console.log('[BSP Cart Button Finder] Found promo_code in promo_data.data:', promoCode);
           }
           // Check other possible locations
           else if (parsedData.promo_code) {
             promoCode = parsedData.promo_code;
             console.log('[BSP Cart Button Finder] Found promo_code at root level:', promoCode);
           } else if (parsedData.lastPromo) {
             promoCode = parsedData.lastPromo;
             console.log('[BSP Cart Button Finder] Found lastPromo at root level:', promoCode);
           }

           if (promoCode) {
             extractedValues.promoCode = String(promoCode);
             if (promoToSalesCodeMap[extractedValues.promoCode]) {
               extractedValues.salescode = promoToSalesCodeMap[extractedValues.promoCode];
             }
           }
         }
       } catch (error) {
         console.error('[BSP Cart Button Finder] Error re-extracting data from mapi:', error);
       }

       return extractedValues;
     }

     console.log('[BSP Cart Button Finder] Main script execution completed');
   }

   // Script initialization occurs via event listener/localStorage
})();