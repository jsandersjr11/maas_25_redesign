(function() {
    console.log('[BSP Cart Script] Script initialized');
    
    // Function to check localStorage with enhanced polling
    function checkLocalStorageWithPolling() {
        console.log('[BSP Cart Script] Starting enhanced localStorage check with polling');
        
        let checkCount = 0;
        const maxChecks = 30; // Extended to 30 seconds for more reliability
        
        function checkLocalStorage() {
            checkCount++;
            console.log(`[BSP Cart Script] Check #${checkCount} for localStorage data...`);
            
            // Check if mapi data exists in localStorage
            const mapiData = localStorage.getItem('mapi');
            if (mapiData) {
                console.log('[BSP Cart Script] Success! MAPI data found in localStorage');
                
                try {
                    // Validate that we can parse the JSON data
                    const parsedData = JSON.parse(mapiData);
                    if (parsedData) {
                        console.log('[BSP Cart Script] MAPI data successfully parsed');
                        console.log('[BSP Cart Script] MAPI data preview:', mapiData.substring(0, 200) + '...');
                        
                        // Check if the data contains the expected structure
                        const hasRequestData = parsedData.requestData && 
                                              parsedData.requestData.fullResponse && 
                                              parsedData.requestData.fullResponse.data;
                                              
                        if (hasRequestData) {
                            console.log('[BSP Cart Script] MAPI data contains expected structure');
                            initializeMainScript(parsedData); // Pass the parsed data to avoid parsing twice
                            return true; // Valid data found, stop checking
                        } else {
                            console.log('[BSP Cart Script] MAPI data found but missing expected structure, continuing to poll...');
                            return false; // Continue checking for complete data
                        }
                    }
                } catch (error) {
                    console.error('[BSP Cart Script] Error parsing MAPI data:', error);
                    return false; // Continue checking if parsing fails
                }
            }
            
            // Check if we've reached the maximum number of checks
            if (checkCount >= maxChecks) {
                console.log('[BSP Cart Script] Maximum check count reached (30 seconds). Proceeding anyway.');
                initializeMainScript(); // Initialize anyway after timeout
                return true; // Max checks reached, stop checking
            }
            
            // Continue checking
            return false;
        }
        
        // Initial check
        if (checkLocalStorage()) {
            return; // Data found and validated on first check
        }
        
        // Set up interval for checking
        const checkInterval = setInterval(() => {
            if (checkLocalStorage()) {
                clearInterval(checkInterval); // Stop checking if data found or max checks reached
            }
        }, 1000); // Check once per second
    }
    
    // Main script function that will be called after localStorage check
    function initializeMainScript(parsedMapiData = null) {
        console.log('[BSP Cart Script] Initializing main script');
        
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
        "162679": "20000225"
    };
    
    // Default salescode if no mapping is found
    let salescode = '20000326';
    let clearlinkeventid = '';
    
    try {
        // Use the already parsed data if provided, otherwise get it from localStorage
        const parsedData = parsedMapiData || (() => {
            const mapiData = localStorage.getItem('mapi');
            return mapiData ? JSON.parse(mapiData) : null;
        })();
        
        if (parsedData) {
            // Log the MAPI data structure for debugging
            console.log('[BSP Cart Script] MAPI data structure found');
            
            // Extract request_id specifically from requestData.fullResponse.data.request_id
            if (parsedData.requestData && 
                parsedData.requestData.fullResponse && 
                parsedData.requestData.fullResponse.data && 
                parsedData.requestData.fullResponse.data.request_id) {
                
                clearlinkeventid = parsedData.requestData.fullResponse.data.request_id;
                console.log('[BSP Cart Script] Extracted request_id (ACSID) from requestData.fullResponse.data:', clearlinkeventid);
            } else {
                console.log('[BSP Cart Script] Could not find request_id in requestData.fullResponse.data');
                // Log the path we're looking for to help debug
                console.log('[BSP Cart Script] Looking for: parsedData.requestData.fullResponse.data.request_id');
                
                // Check if each part of the path exists
                if (parsedData.requestData) {
                    console.log('[BSP Cart Script] parsedData.requestData exists');
                    if (parsedData.requestData.fullResponse) {
                        console.log('[BSP Cart Script] parsedData.requestData.fullResponse exists');
                        if (parsedData.requestData.fullResponse.data) {
                            console.log('[BSP Cart Script] parsedData.requestData.fullResponse.data exists');
                            console.log('[BSP Cart Script] Available properties:', Object.keys(parsedData.requestData.fullResponse.data));
                        }
                    }
                }
            }
            
            // Extract promo_code specifically from requestData.fullResponse.data.promo_code
            let promoCode = null;
            
            if (parsedData.requestData && 
                parsedData.requestData.fullResponse && 
                parsedData.requestData.fullResponse.data && 
                parsedData.requestData.fullResponse.data.promo_code) {
                
                promoCode = parsedData.requestData.fullResponse.data.promo_code;
                console.log('[BSP Cart Script] Extracted promo_code from requestData.fullResponse.data:', promoCode);
            } else {
                console.log('[BSP Cart Script] Could not find promo_code in requestData.fullResponse.data');
                // Log the path we're looking for to help debug
                console.log('[BSP Cart Script] Looking for: parsedData.requestData.fullResponse.data.promo_code');
                
                // Check if each part of the path exists
                if (parsedData.requestData) {
                    console.log('[BSP Cart Script] parsedData.requestData exists');
                    if (parsedData.requestData.fullResponse) {
                        console.log('[BSP Cart Script] parsedData.requestData.fullResponse exists');
                        if (parsedData.requestData.fullResponse.data) {
                            console.log('[BSP Cart Script] parsedData.requestData.fullResponse.data exists');
                            console.log('[BSP Cart Script] Available properties:', Object.keys(parsedData.requestData.fullResponse.data));
                        }
                    }
                }
            }
            
            if (promoCode) {
                // Convert to string to ensure proper lookup
                promoCode = String(promoCode);
                console.log('Extracted promo_code:', promoCode);
                
                // Look up the sales code from the mapping
                if (promoToSalesCodeMap[promoCode]) {
                    salescode = promoToSalesCodeMap[promoCode];
                    console.log('Mapped to sales code:', salescode);
                } else {
                    console.log('No mapping found for promo code:', promoCode, 'using default sales code:', salescode);
                }
            } else {
                console.log('No promo_code found in mapi data, using default sales code:', salescode);
            }
        }
    } catch (error) {
        console.error('Error extracting data from mapi:', error);
    }

    // Initial construction of the dynamic URL with ACSID parameter using the extracted request_id
    let buyflowUrl = `http://brspdnextcaqa2.brightspeed.com/?affprog=clearlink&salescode=${salescode}&CookieTime=30Day${clearlinkeventid ? `&ACSID=${clearlinkeventid}` : ''}`;
    
    // Store initial values for comparison after page load
    const initialValues = {
        salescode,
        clearlinkeventid
    };
    
    // Function to extract values from mapi
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
                
                // Extract request_id
                extractedValues.clearlinkeventid = parsedData.requestId || initialValues.clearlinkeventid;
                
                // Extract promo_code
                let promoCode = null;
                if (parsedData.requestData && parsedData.requestData.fullResponse && 
                    parsedData.requestData.fullResponse.data && 
                    parsedData.requestData.fullResponse.data.promo_code) {
                    promoCode = parsedData.requestData.fullResponse.data.promo_code;
                } else if (parsedData.promo_code) {
                    promoCode = parsedData.promo_code;
                } else if (parsedData.lastPromo) {
                    promoCode = parsedData.lastPromo;
                }
                
                if (promoCode) {
                    extractedValues.promoCode = String(promoCode);
                    
                    // Look up the sales code
                    if (promoToSalesCodeMap[extractedValues.promoCode]) {
                        extractedValues.salescode = promoToSalesCodeMap[extractedValues.promoCode];
                    }
                }
            }
        } catch (error) {
            console.error('Error re-extracting data from mapi:', error);
        }
        
        return extractedValues;
    }
    
    // Check values again after page load and update if needed
    window.addEventListener('load', function() {
        console.log('Page fully loaded, checking mapi values again...');
        
        const updatedValues = extractMapiValues();
        let valuesChanged = false;
        
        // Check if values have changed
        if (updatedValues.salescode !== initialValues.salescode) {
            console.log(`Sales code changed: ${initialValues.salescode} -> ${updatedValues.salescode}`);
            valuesChanged = true;
        }
        
        if (updatedValues.clearlinkeventid !== initialValues.clearlinkeventid) {
            console.log(`ACSID changed: ${initialValues.clearlinkeventid} -> ${updatedValues.clearlinkeventid}`);
            valuesChanged = true;
        }
        
        // If values changed, update the URL and button href
        if (valuesChanged) {
            console.log('Values changed after page load, updating button URL...');
            buyflowUrl = `https://shop.brightspeed.com/uas/?affprog=clearlink&salescode=${updatedValues.salescode}&CookieTime=30Day${updatedValues.clearlinkeventid ? `&ACSID=${updatedValues.clearlinkeventid}` : ''}`;
            
            // Find the button and update its href
            const buttonLink = document.querySelector('.bsp-cart .leshen-link');
            if (buttonLink) {
                buttonLink.href = buyflowUrl;
                console.log('Button URL updated successfully');
            } else {
                console.error('Button not found for URL update');
            }
        } else {
            console.log('No changes to mapi values after page load');
        }
    });

    // The HTML structure for the button, with the dynamic href
    const newButtonHtml = `
        <a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0" href="${buyflowUrl}" visibility="All devices">
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
        </a>
    `;

    // Find the target div and replace its content with the new button
    const targetDiv = document.querySelector('.bsp-cart');
    if (targetDiv) {
        targetDiv.innerHTML = newButtonHtml;
    } else {
        console.error('[BSP Cart Script] Target div with class .bsp-cart not found.');
    }
    
    // Log completion of main script
    console.log('[BSP Cart Script] Main script execution completed');
}

// Start the process by checking localStorage first
checkLocalStorageWithPolling();

})();