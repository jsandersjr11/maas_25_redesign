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

     // Define the promo code to sales code mapping (copied to match other scripts)
     const promoToSalesCodeMap = {
       "169046": "20000203",
       "169047": "20000204",
       "169048": "20000204",
       "169049": "20000204",
       "169050": "20000204",
       "169051": "20000204",
       "169052": "20000203",
       "169053": "20000204",
       "169054": "20000204",
       "169055": "20000204",
       "169056": "20000204",
       "169057": "20000204",
       "169289": "20000204",
       "169290": "20000221",
       "169291": "20000221",
       "169292": "20000221",
       "169293": "20000221",
       "169294": "20000204",
       "169295": "20000221",
       "169296": "20000221",
       "169297": "20000221",
       "169298": "20000221",
       "169343": "20000221",
       "169344": "20000221",
       "169345": "20000221",
       "169349": "20000221",
       "169350": "20000221",
       "169351": "20000221",
       "169323": "20000203",
       "169324": "20000204",
       "169325": "20000204",
       "169326": "20000204",
       "169327": "20000204",
       "169328": "20000204",
       "169329": "20000221",
       "169330": "20000221",
       "169331": "20000221",
       "169332": "20000221",
       "169333": "20000203",
       "169334": "20000204",
       "169335": "20000204",
       "169336": "20000204",
       "169337": "20000204",
       "169338": "20000204",
       "169339": "20000221",
       "169340": "20000221",
       "169341": "20000221",
       "169342": "20000221",
       "169346": "20000221",
       "169347": "20000221",
       "169348": "20000221",
       "169352": "20000221",
       "169353": "20000221",
       "169354": "20000221",
       "169370": "20000204",
       "169371": "20000204",
       "162955": "20000203",
       "162956": "20000204",
       "162957": "20000204",
       "162958": "20000204",
       "162959": "20000204",
       "162960": "20000204",
       "162961": "20000221",
       "162962": "20000221",
       "162963": "20000221",
       "162964": "20000204",
       "162965": "20000204",
       "162966": "20000204",
       "162967": "20000204",
       "162968": "20000204",
       "162969": "20000204",
       "162970": "20000221",
       "162971": "20000222",
       "162972": "20000203",
       "162973": "20000204",
       "162974": "20000204",
       "162975": "20000204",
       "162976": "20000204",
       "162977": "20000204",
       "162978": "20000221",
       "162979": "20000221",
       "162980": "20000221",
       "162981": "20000204",
       "162982": "20000204",
       "162983": "20000204",
       "162984": "20000204",
       "162985": "20000204",
       "162986": "20000204",
       "162987": "20000221",
       "162988": "20000222",
       "162841": "20000203",
       "169385": "20000204",
       "169386": "20000204",
       "169387": "20000204",
       "169388": "20000204",
       "169389": "20000204",
       "169390": "20000221",
       "169391": "20000221",
       "169392": "20000221",
       "169393": "20000204",
       "169394": "20000204",
       "169395": "20000204",
       "162843": "20000204",
       "169396": "20000204",
       "169397": "20000204",
       "162842": "20000221",
       "162844": "20000222",
       "162845": "20000203",
       "169398": "20000204",
       "169399": "20000204",
       "169400": "20000204",
       "169401": "20000204",
       "169402": "20000204",
       "169403": "20000221",
       "169404": "20000221",
       "169405": "20000221",
       "169406": "20000204",
       "169407": "20000204",
       "169408": "20000204",
       "162847": "20000204",
       "169409": "20000204",
       "169410": "20000204",
       "162846": "20000221",
       "162848": "20000222",
       "162710": "20000211",
       "162671": "20000211",
       "162662": "20000211",
       "162869": "20000211",
       "162715": "20000211",
       "162884": "20000211",
       "162895": "20000211",
       "162931": "20000211",
       "162812": "20000211",
       "162894": "20000211",
       "162830": "20000211",
       "162885": "20000211",
       "162917": "20000211",
       "162901": "20000211",
       "162915": "20000211",
       "162713": "20000225",
       "162716": "20000211",
       "162887": "20000211",
       "162916": "20000211",
       "162938": "20000211",
       "163945": "20000211",
       "162813": "20000211",
       "162876": "20000211",
       "162897": "20000211",
       "162907": "20000211",
       "162913": "20000211",
       "162711": "20000211",
       "162827": "20000225",
       "162918": "20000211",
       "162926": "20000211",
       "162719": "20000211",
       "162875": "20000211",
       "162888": "20000211",
       "162714": "20000211",
       "162828": "20000211",
       "162873": "20000211",
       "162937": "20000211",
       "162908": "20000211",
       "162914": "20000211",
       "162912": "20000211",
       "162928": "20000211",
       "162909": "20000211",
       "162934": "20000211",
       "162921": "20000211",
       "162717": "20000225",
       "163944": "20000211",
       "162893": "20000211",
       "162871": "20000211",
       "162896": "20000211",
       "162936": "20000211",
       "165089": "20000211",
       "162826": "20000211",
       "162892": "20000211",
       "162939": "20000211",
       "162924": "20000211",
       "162880": "20000211",
       "162874": "20000211",
       "162881": "20000211",
       "162882": "20000211",
       "162940": "20000211",
       "162943": "20000211",
       "162690": "20000211",
       "162829": "20000211",
       "162831": "20000211",
       "161931": "20000211",
       "162718": "20000211",
       "162866": "20000211",
       "162878": "20000211",
       "162720": "20000211",
       "162832": "20000211",
       "162877": "20000211",
       "162889": "20000211",
       "162890": "20000211",
       "165090": "20000211",
       "162905": "20000211",
       "162910": "20000211",
       "162919": "20000211",
       "162923": "20000211",
       "162824": "20000211",
       "162870": "20000211",
       "162927": "20000211",
       "162935": "20000211",
       "162809": "20000211",
       "162811": "20000211",
       "162883": "20000211",
       "162721": "20000211",
       "162942": "20000211",
       "162944": "20000211",
       "162902": "20000211",
       "162903": "20000211",
       "162879": "20000211",
       "165087": "20000211",
       "162925": "20000211",
       "162932": "20000211",
       "162825": "20000211",
       "162886": "20000211",
       "162920": "20000211",
       "162930": "20000211",
       "162872": "20000211",
       "162899": "20000211",
       "162900": "20000211",
       "165088": "20000211",
       "162911": "20000211",
       "162929": "20000211",
       "162933": "20000211",
       "162810": "20000211",
       "162922": "20000211",
       "162898": "20000211",
       "162906": "20000211",
       "162891": "20000211",
       "162941": "20000211",
       "162712": "20000211",
       "162867": "20000211",
       "162682": "20000225",
       "162679": "20000225",
       "162668": "20000220",
       "162677": "20000220"
     };

     // Defaults
     let salescode = '20000217';
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
         if (!clearlinkeventid) {
           if (parsedData.requestId) {
             clearlinkeventid = parsedData.requestId;
           } else if (parsedData.requestData && parsedData.requestData.requestId) {
             clearlinkeventid = parsedData.requestData.requestId;
           } else if (
             parsedData.requestData &&
             parsedData.requestData.fullResponse &&
             parsedData.requestData.fullResponse.data &&
             parsedData.requestData.fullResponse.data.request_id
           ) {
             clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
           }
         }

         let promoCode = null;
         if (
           parsedData.requestData &&
           parsedData.requestData.fullResponse &&
           parsedData.requestData.fullResponse.data &&
           parsedData.requestData.fullResponse.data.promo_code
         ) {
           promoCode = parsedData.requestData.fullResponse.data.promo_code;
         } else if (
           parsedData.requestData &&
           parsedData.requestData.fullResponse &&
           parsedData.requestData.fullResponse.data &&
           parsedData.requestData.fullResponse.data.promo_data &&
           parsedData.requestData.fullResponse.data.promo_data.data &&
           parsedData.requestData.fullResponse.data.promo_data.data.promo_code
         ) {
           promoCode = parsedData.requestData.fullResponse.data.promo_data.data.promo_code;
         } else if (parsedData.promo_code) {
           promoCode = parsedData.promo_code;
         } else if (parsedData.lastPromo) {
           promoCode = parsedData.lastPromo;
         }

         if (promoCode) {
           promoCode = String(promoCode);
           if (promoToSalesCodeMap[promoCode]) {
             salescode = promoToSalesCodeMap[promoCode];
           }
         }
       }
     } catch (error) {
       console.error('[BSP Cart Button Finder] Error extracting data from mapi:', error);
     }

     // Build URL
     let buyflowUrl = `https://brspdnextcaqa2.brightspeed.com/?affprog=clearlink&salescode=${salescode}&cookietime=30day${
       clearlinkeventid ? `&acsid=${clearlinkeventid}` : ''
     }`;

     // Process inside <main> > first <section> > .content per scenarios
     function processScopedLinks(url) {
       const mainEl = document.querySelector('main');
       if (!mainEl) {
         console.log('[BSP Cart Button Finder] <main> not found');
         return;
       }
       const firstSection = mainEl.querySelector('section');
       if (!firstSection) {
         console.log('[BSP Cart Button Finder] No <section> inside <main>');
         return;
       }
       const content = firstSection.querySelector('.content');
       if (!content) {
         console.log('[BSP Cart Button Finder] .content not found inside first <section>');
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

         const newButtonHtml = `
         <a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0" href="${url}" data-bsp-injected="1" visibility="All devices">
             <button class="leshen-link-button convert-link-button css-4o5p4y" color="dark" tabindex="0" type="button" style="
                 padding-top: 16px;
                 padding-bottom: 16px;
                 padding-left: 2.75rem;
                 padding-right: 48px;
                 box-shadow: none;
                 margin-top: 24px;
             ">
                 <span class="button-text css-2qtueq e1hk20aw0" style="
                     font-weight: 500;
                     font-size: calc(0.5555555555555556vw + 17.333333333333332px);
                     line-height: calc(1.1111111111111112vw + 18.666666666666668px);
                 ">Check availability</span>
             </button>
         </a>`;

         try {
           telAnchor.insertAdjacentHTML('afterend', newButtonHtml);
           console.log('[BSP Cart Button Finder] Injected buyflow button after tel: link');
         } catch (e) {
           console.error('[BSP Cart Button Finder] Failed injecting button near tel: link', e);
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
     processScopedLinks(buyflowUrl);
     processAllCartLinks(buyflowUrl);

     // Re-check on load
     window.addEventListener('load', function () {
       console.log('[BSP Cart Button Finder] Page fully loaded, checking mapi values again...');
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
         buyflowUrl = `https://brspdnextcaqa2.brightspeed.com/?affprog=clearlink&salescode=${updatedValues.salescode}&cookietime=30day${
           updatedValues.clearlinkeventid ? `&acsid=${updatedValues.clearlinkeventid}` : ''
         }`;
         processScopedLinks(buyflowUrl);
         processAllCartLinks(buyflowUrl);
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

           if (parsedData.requestId) {
             extractedValues.clearlinkeventid = parsedData.requestId;
           } else if (parsedData.requestData && parsedData.requestData.requestId) {
             extractedValues.clearlinkeventid = parsedData.requestData.requestId;
           } else if (
             parsedData.requestData &&
             parsedData.requestData.fullResponse &&
             parsedData.requestData.fullResponse.data &&
             parsedData.requestData.fullResponse.data.request_id
           ) {
             extractedValues.clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
           }

           let promoCode = null;
           if (
             parsedData.requestData &&
             parsedData.requestData.fullResponse &&
             parsedData.requestData.fullResponse.data &&
             parsedData.requestData.fullResponse.data.promo_code
           ) {
             promoCode = parsedData.requestData.fullResponse.data.promo_code;
           } else if (
             parsedData.requestData &&
             parsedData.requestData.fullResponse &&
             parsedData.requestData.fullResponse.data &&
             parsedData.requestData.fullResponse.data.promo_data &&
             parsedData.requestData.fullResponse.data.promo_data.data &&
             parsedData.requestData.fullResponse.data.promo_data.data.promo_code
           ) {
             promoCode = parsedData.requestData.fullResponse.data.promo_data.data.promo_code;
           } else if (parsedData.promo_code) {
             promoCode = parsedData.promo_code;
           } else if (parsedData.lastPromo) {
             promoCode = parsedData.lastPromo;
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