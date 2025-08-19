(function() {
    console.log('[BSP Cart Link Updater] Script initialized');

    // Set up a fallback timeout in case the event never fires
    let scriptInitialized = false;
    const fallbackTimeout = setTimeout(() => {
        if (!scriptInitialized) {
            console.log('[BSP Cart Link Updater] Fallback timeout reached. Initializing script anyway.');
            initializeMainScript();
        }
    }, 30000); // 30 second fallback

    // Listen for the mapiRequestIdReady event
    document.addEventListener('mapiRequestIdReady', (e) => {
        console.log('[BSP Cart Link Updater] mapiRequestIdReady event received');
        const requestId = e?.detail?.requestId;
        console.log('[BSP Cart Link Updater] Request ID from event:', requestId);

        if (requestId && !scriptInitialized) {
            scriptInitialized = true;
            clearTimeout(fallbackTimeout);

            // Try to get the full mapi data from localStorage
            try {
                const mapiData = localStorage.getItem('mapi');
                if (mapiData) {
                    const parsedData = JSON.parse(mapiData);
                    console.log('[BSP Cart Link Updater] MAPI data found in localStorage');
                    initializeMainScript(parsedData, requestId);
                } else {
                    console.log('[BSP Cart Link Updater] No MAPI data in localStorage, using event data only');
                    // Create a minimal data object with just the requestId
                    const minimalData = { requestId: requestId };
                    initializeMainScript(minimalData, requestId);
                }
            } catch (error) {
                console.error('[BSP Cart Link Updater] Error processing MAPI data:', error);
                // Create a minimal data object with just the requestId
                const minimalData = { requestId: requestId };
                initializeMainScript(minimalData, requestId);
            }
        } else if (!requestId) {
            console.log('[BSP Cart Link Updater] Event received but no requestId found in event details');
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
                console.log('[BSP Cart Link Updater] MAPI data already exists in localStorage with requestId');
                scriptInitialized = true;
                clearTimeout(fallbackTimeout);
                initializeMainScript(parsedData);
            }
        }
    } catch (error) {
        console.error('[BSP Cart Link Updater] Error checking initial localStorage:', error);
    }

    // Main script function that will be called after event or localStorage check
    function initializeMainScript(parsedMapiData = null, eventRequestId = null) {
        console.log('[BSP Cart Link Updater] Initializing main script');

        // Define the promo code to sales code mapping
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

        // Default salescode if no mapping is found
        let salescode = '20000217';
        let clearlinkeventid = '';

        try {
            // If we have an event requestId, use it as the primary source
            if (eventRequestId) {
                clearlinkeventid = eventRequestId;
                console.log('[BSP Cart Link Updater] Using requestId from event:', clearlinkeventid);
            }

            // Use the already parsed data if provided, otherwise get it from localStorage
            const parsedData =
                parsedMapiData ||
                (() => {
                    const mapiData = localStorage.getItem('mapi');
                    return mapiData ? JSON.parse(mapiData) : null;
                })();

            if (parsedData) {
                console.log('[BSP Cart Link Updater] MAPI data structure found');
                console.log('[BSP Cart Link Updater] Root level keys:', Object.keys(parsedData));

                // Extract request_id - check all possible locations if we don't already have it from the event
                if (!clearlinkeventid) {
                    if (parsedData.requestId) {
                        clearlinkeventid = parsedData.requestId;
                        console.log('[BSP Cart Link Updater] Extracted requestId (ACSID) from root level:', clearlinkeventid);
                    } else if (parsedData.requestData && parsedData.requestData.requestId) {
                        clearlinkeventid = parsedData.requestData.requestId;
                        console.log('[BSP Cart Link Updater] Extracted requestId (ACSID) from requestData:', clearlinkeventid);
                    } else if (
                        parsedData.requestData &&
                        parsedData.requestData.fullResponse &&
                        parsedData.requestData.fullResponse.data &&
                        parsedData.requestData.fullResponse.data.request_id
                    ) {
                        clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
                        console.log('[BSP Cart Link Updater] Extracted request_id (ACSID) from fullResponse.data:', clearlinkeventid);
                    } else {
                        console.log('[BSP Cart Link Updater] Could not find request_id in any expected location');
                    }
                }

                // Extract promo_code - check all possible locations
                let promoCode = null;

                if (
                    parsedData.requestData &&
                    parsedData.requestData.fullResponse &&
                    parsedData.requestData.fullResponse.data &&
                    parsedData.requestData.fullResponse.data.promo_code
                ) {
                    promoCode = parsedData.requestData.fullResponse.data.promo_code;
                    console.log('[BSP Cart Link Updater] Extracted promo_code from fullResponse.data:', promoCode);
                } else if (
                    parsedData.requestData &&
                    parsedData.requestData.fullResponse &&
                    parsedData.requestData.fullResponse.data &&
                    parsedData.requestData.fullResponse.data.promo_data &&
                    parsedData.requestData.fullResponse.data.promo_data.data &&
                    parsedData.requestData.fullResponse.data.promo_data.data.promo_code
                ) {
                    promoCode = parsedData.requestData.fullResponse.data.promo_data.data.promo_code;
                    console.log('[BSP Cart Link Updater] Extracted promo_code from promo_data.data:', promoCode);
                } else if (parsedData.promo_code) {
                    promoCode = parsedData.promo_code;
                    console.log('[BSP Cart Link Updater] Extracted promo_code from root level:', promoCode);
                } else if (parsedData.lastPromo) {
                    promoCode = parsedData.lastPromo;
                    console.log('[BSP Cart Link Updater] Extracted lastPromo from root level:', promoCode);
                } else {
                    console.log('[BSP Cart Link Updater] Could not find promo_code in any expected location');
                }

                if (promoCode) {
                    promoCode = String(promoCode);
                    if (promoToSalesCodeMap[promoCode]) {
                        salescode = promoToSalesCodeMap[promoCode];
                        console.log('[BSP Cart Link Updater] Mapped to sales code:', salescode);
                    } else {
                        console.log('[BSP Cart Link Updater] No mapping found for promo code:', promoCode, 'using default sales code:', salescode);
                    }
                } else {
                    console.log('[BSP Cart Link Updater] No promo_code found in mapi data, using default sales code:', salescode);
                }
            }
        } catch (error) {
            console.error('[BSP Cart Link Updater] Error extracting data from mapi:', error);
        }

        // Initial construction of the dynamic URL with ACSID parameter using the extracted request_id
        let buyflowUrl = `https://brspdnextcaqa2.brightspeed.com/?affprog=clearlink&salescode=${salescode}&cookietime=30day${
            clearlinkeventid ? `&acsid=${clearlinkeventid}` : ''
        }`;

        // Helper: update all anchors with href containing /cart
        function updateCartAnchors(url) {
            const anchors = document.querySelectorAll('a[href*="/cart"]');
            if (!anchors || anchors.length === 0) {
                console.log('[BSP Cart Link Updater] No <a> elements containing /cart found to update');
                return;
            }
            anchors.forEach((a) => {
                try {
                    a.href = url;
                } catch (e) {
                    console.error('[BSP Cart Link Updater] Failed updating anchor href', a, e);
                }
            });
            console.log(`[BSP Cart Link Updater] Updated ${anchors.length} anchor(s) containing /cart`);
        }

        // Store initial values for comparison after page load
        const initialValues = {
            salescode,
            clearlinkeventid
        };

        // Apply initial update as soon as we have a URL
        updateCartAnchors(buyflowUrl);

        // Function to extract values from mapi (re-check after load)
        function extractMapiValues() {
            let extractedValues = {
                salescode: initialValues.salescode,
                clearlinkeventid: initialValues.clearlinkeventid,
                promoCode: null
            };

            try {
                const mapiData = localStorage.getItem('mapi');
                if (mapiData) {
                    const parsedData = JSON.parse(mapiData);
                    console.log('[BSP Cart Link Updater] Re-extracting values from mapi data');

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
                console.error('[BSP Cart Link Updater] Error re-extracting data from mapi:', error);
            }

            return extractedValues;
        }

        // Check values again after page load and update if needed
        window.addEventListener('load', function () {
            console.log('[BSP Cart Link Updater] Page fully loaded, checking mapi values again...');

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
                console.log('[BSP Cart Link Updater] Values changed after page load, updating cart link URLs...');
                buyflowUrl = `https://brspdnextcaqa2.brightspeed.com/?affprog=clearlink&salescode=${updatedValues.salescode}&cookietime=30day${
                    updatedValues.clearlinkeventid ? `&acsid=${updatedValues.clearlinkeventid}` : ''
                }`;
                updateCartAnchors(buyflowUrl);
            } else {
                console.log('[BSP Cart Link Updater] No changes to mapi values after page load');
            }
        });

        // Log completion of main script
        console.log('[BSP Cart Link Updater] Main script execution completed');
    }

    // Script initialization happens via the event listener
    // No need to call any function here as the event listener is already set up
})();
