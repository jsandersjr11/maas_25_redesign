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
 
      // Function to build promo code map from CSV data
      function buildPromoMap(csvText) {
        const map = {};
        if (!csvText || typeof csvText !== 'string') return map;
        const lines = csvText.split(/\r?\n/);
        for (let i = 1; i < lines.length; i++) { // skip header
          const line = lines[i].trim();
          if (!line) continue;
          const parts = line.split(',');
          if (parts.length < 2) continue;
          const promo = parts[0].trim();
          const sales = parts[1].trim();
          if (!promo || !sales) continue;
          map[promo] = sales; // last occurrence wins
        }
        return map;
      }
      

      // Override mapping from embedded CSV content (last occurrence wins)
      const csvMappingData = `Promo Code,Sales Code
117743,8008926
117831,8008926
117832,8008926
117837,8008926
118399,8008926
119036,8008926
119037,8008926
119088,8008926
119089,8008926
119094,8008926
119095,8008926
119096,8008926
119098,8008926
119099,8008926
119100,8008926
119101,8008926
119222,8008926
120325,8008926
120331,8008926
120868,8008926
121480,8008926
121484,8008926
121485,8008926
121486,8008926
121487,8008926
121490,8008926
121492,8008926
121494,8008926
121497,8008926
121498,8008926
121499,8008926
121501,8008926
121513,8008926
121515,8008926
121517,8008926
123115,8008926
124049,8008926
124050,8008926
124051,8008926
124053,8008926
124054,8008926
12747,8008926
148613,8008926
148997,8008926
148998,8008926
149926,8008926
150106,8008926
150121,8008926
150122,8008926
151038,8008926
151509,8008926
151510,8008926
151512,8008926
153698,8008926
155273,8008926
155290,8008926
156944,8008926
156945,8008926
157007,8008926
157706,8008926
157831,8008926
157832,8008926
158031,8008926
158032,8008926
158514,8008926
159068,8008926
159760,8008926
159768,8008926
159770,8008926
159771,8008926
159772,8008926
159773,8008926
159774,8008926
159775,8008926
159776,8008926
159777,8008926
159778,8008926
160265,8008926
16029,8008926
167486,8008926
167667,8008926
167674,8008926
167723,8008926
167724,8008926
168158,8008926
168160,8008926
168161,8008926
168162,8008926
168165,8008926
168178,8008926
168714,8008926
168715,8008926
168741,8008926
168742,8008926
168743,8008926
168932,8008926
168933,8008926
168934,8008926
168935,8008926
168936,8008926
168999,8008926
169000,8008926
169114,8008926
169123,8008926
169666,8008926
171060,8008926
171061,8008926
171062,8008926
171063,8008926
171064,8008926
171065,8008926
171106,8008926
171107,8008926
171939,8008926
172024,8008926
172522,8008926
20013,8008926
24942,8008926
26101,8008926
26102,8008926
26113,8008926
26114,8008926
28589,8008926
28593,8008926
49012,8008926
49615,8008926
49616,8008926
54402,8008926
56413,8008926
57757,8008926
57758,8008926
57760,8008926
57762,8008926
57766,8008926
57769,8008926
57771,8008926
57773,8008926
57774,8008926
57775,8008926
57778,8008926
57779,8008926
57781,8008926
57782,8008926
57785,8008926
57787,8008926
57789,8008926
57792,8008926
57793,8008926
57794,8008926
57795,8008926
57803,8008926
57813,8008926
57814,8008926
57815,8008926
57816,8008926
57817,8008926
57819,8008926
57821,8008926
57823,8008926
57824,8008926
57829,8008926
57830,8008926
57831,8008926
57832,8008926
57834,8008926
57837,8008926
57840,8008926
57843,8008926
57844,8008926
57845,8008926
57846,8008926
57847,8008926
57848,8008926
57849,8008926
57850,8008926
57851,8008926
57852,8008926
57853,8008926
57857,8008926
57858,8008926
57859,8008926
57860,8008926
57861,8008926
57862,8008926
57864,8008926
57868,8008926
57869,8008926
57871,8008926
57883,8008926
57884,8008926
57886,8008926
57887,8008926
57888,8008926
57889,8008926
57892,8008926
57894,8008926
57896,8008926
57897,8008926
57898,8008926
57899,8008926
57901,8008926
57904,8008926
57906,8008926
57907,8008926
57911,8008926
57912,8008926
57914,8008926
57915,8008926
57916,8008926
57917,8008926
57918,8008926
57919,8008926
57921,8008926
57924,8008926
57925,8008926
57926,8008926
57927,8008926
57928,8008926
57929,8008926
57930,8008926
57931,8008926
57932,8008926
57933,8008926
57934,8008926
57935,8008926
57936,8008926
57937,8008926
57938,8008926
57940,8008926
57941,8008926
57942,8008926
57943,8008926
57948,8008926
57949,8008926
57951,8008926
57954,8008926
57956,8008926
57959,8008926
57961,8008926
57964,8008926
57969,8008926
57972,8008926
57978,8008926
57979,8008926
57980,8008926
57982,8008926
57984,8008926
57986,8008926
57990,8008926
57991,8008926
57994,8008926
57995,8008926
57997,8008926
58004,8008926
58005,8008926
58010,8008926
58013,8008926
58014,8008926
58015,8008926
58017,8008926
58019,8008926
58025,8008926
58028,8008926
58032,8008926
58034,8008926
58035,8008926
58036,8008926
58037,8008926
58038,8008926
58039,8008926
58040,8008926
58044,8008926
58046,8008926
58054,8008926
58055,8008926
58058,8008926
58060,8008926
58061,8008926
58064,8008926
58065,8008926
58068,8008926
58069,8008926
58071,8008926
58072,8008926
58074,8008926
59098,8008926
59099,8008926
59827,8008926
59828,8008926
60156,8008926
61564,8008926
62194,8008926
64143,8008926
64144,8008926
64148,8008926
64153,8008926
64154,8008926
64155,8008926
64162,8008926
64163,8008926
67927,8008926
67928,8008926
67929,8008926
67930,8008926
67931,8008926
67932,8008926
67933,8008926
67934,8008926
67935,8008926
67936,8008926
67937,8008926
67941,8008926
67942,8008926
67943,8008926
68249,8008926
68251,8008926
68256,8008926
68258,8008926
68259,8008926
70439,8008926
70440,8008926
70443,8008926
70824,8008926
70834,8008926
70835,8008926
70837,8008926
70845,8008926
71158,8008926
71159,8008926
72643,8008926
79579,8008926
79580,8008926
79582,8008926
79583,8008926
79584,8008926
79585,8008926
79586,8008926
79849,8008926
80725,8008926
80727,8008926
80729,8008926
80730,8008926
81524,8008926
81629,8008926
81702,8008926
81703,8008926
82639,8008926
82702,8008926
83263,8008926
83264,8008926
83265,8008926
83267,8008926
83268,8008926
83269,8008926
83270,8008926
83272,8008926
92506,8008926
92507,8008926
92508,8008926
92509,8008926
92511,8008926
92514,8008926
92515,8008926
92518,8008926
92519,8008926
95859,8008926
96034,8008926
96035,8008926
96037,8008926
96040,8008926
96041,8008926
97198,8008926
97199,8008926
97200,8008926
97202,8008926
97203,8008926
97300,8008926
97303,8008926
98304,8008926
98345,8008926
99407,8008926
99417,8008926
99418,8008926
99419,8008926
99420,8008926
99424,8008926
99425,8008926
99426,8008926
99428,8008926
99430,8008926
99432,8008926
99433,8008926
99436,8008926
99442,8008926
99443,8008926
99444,8008926
99445,8008926
99446,8008926
168760,8008927
168955,8008927
168961,8008927
168963,8008927
169142,8008927
169144,8008927
169257,8008927
169261,8008927
169273,8008927
169275,8008927
169355,8008927
169895,8008927
169938,8008927
169968,8008927
169972,8008927
169976,8008927
170047,8008927
170096,8008927
170804,8008927
170864,8008927
170865,8008927
170992,8008927
171068,8008927
171822,8008927
172038,8008927
172545,8008927
172579,8008927
172671,8008927
170543,8012114
163034,8008928
163042,8008928
170529,8008928
170545,8008928
111786,8008929
158617,8008929
158869,8008929
168951,8008929
168957,8008929
168959,8008929
169016,8008929
169028,8008929
169038,8008929
169263,8008929
169265,8008929
169267,8008929
169269,8008929
169277,8008929
169279,8008929
169281,8008929
169283,8008929
169357,8008929
169669,8008929
169898,8008929
169940,8008929
169970,8008929
169974,8008929
169978,8008929
170049,8008929
170092,8008929
170098,8008929
170806,8008929
170862,8008929
170863,8008929
170900,8008929
170990,8008929
171070,8008929
171824,8008929
172040,8008929
172535,8008929
172543,8008929
124050,8008929
124051,8008929
124053,8008929
124054,8008929
12747,8008929
148613,8008929
148997,8008929
148998,8008929
149926,8008929
150106,8008929
150121,8008929
150122,8008929
151038,8008929
151509,8008929
151510,8008929
151512,8008929
153698,8008929
155273,8008929
155290,8008929
156944,8008929
156945,8008929
157007,8008929
157706,8008929
157831,8008929
157832,8008929
158031,8008929
158032,8008929
158514,8008929
159068,8008929
159760,8008929
159768,8008929
159770,8008929
159771,8008929
159772,8008929
159773,8008929
159774,8008929
159775,8008929
159776,8008929
159777,8008929
159778,8008929
160265,8008929
16029,8008929
167486,8008929
167667,8008929
167674,8008929
167723,8008929
167724,8008929
168158,8008929
168160,8008929
168161,8008929
168162,8008929
168165,8008929
168178,8008929
168714,8008929
168715,8008929
168741,8008929
168742,8008929
168743,8008929
168932,8008929
168933,8008929
168934,8008929
168935,8008929
168936,8008929
168999,8008929
169000,8008929
169114,8008929
169123,8008929
169666,8008929
171060,8008929
171061,8008929
171062,8008929
171063,8008929
171064,8008929
171065,8008929
171106,8008929
171107,8008929
171939,8008929
172024,8008929
172522,8008929
20013,8008929
24942,8008929
26101,8008929
26102,8008929
26113,8008929
26114,8008929
28589,8008929
28593,8008929
49012,8008929
49615,8008929
49616,8008929
54402,8008929
56413,8008929
57757,8008929
57758,8008929
57760,8008929
57762,8008929
57766,8008929
57769,8008929
57771,8008929
57773,8008929
57774,8008929
57775,8008929
57778,8008929
57779,8008929
57781,8008929
57782,8008929
57785,8008929
57787,8008929
57789,8008929
57792,8008929
57793,8008929
57794,8008929
57795,8008929
57803,8008929
57813,8008929
57814,8008929
57815,8008929
57816,8008929
57817,8008929
57819,8008929
57821,8008929
57823,8008929
57824,8008929
57829,8008929
57830,8008929
57831,8008929
57832,8008929
57834,8008929
57837,8008929
57840,8008929
57843,8008929
57844,8008929
57845,8008929
57846,8008929
57847,8008929
57848,8008929
57849,8008929
57850,8008929
57851,8008929
57852,8008929
57853,8008929
57857,8008929
57858,8008929
57859,8008929
57860,8008929
57861,8008929
57862,8008929
57864,8008929
57868,8008929
57869,8008929
57871,8008929
57883,8008929
57884,8008929
57886,8008929
57887,8008929
57888,8008929
57889,8008929
57892,8008929
57894,8008929
57896,8008929
57897,8008929
57898,8008929
57899,8008929
57901,8008929
57904,8008929
57906,8008929
57907,8008929
57911,8008929
57912,8008929
57914,8008929
57915,8008929
57916,8008929
57917,8008929
57918,8008929
57919,8008929
57921,8008929
57924,8008929
57925,8008929
57926,8008929
57927,8008929
57928,8008929
57929,8008929
57930,8008929
57931,8008929
57932,8008929
57933,8008929
57934,8008929
57935,8008929
57936,8008929
57937,8008929
57938,8008929
57940,8008929
57941,8008929
57942,8008929
57943,8008929
57948,8008929
57949,8008929
57951,8008929
57954,8008929
57956,8008929
57959,8008929
57961,8008929
57964,8008929
57969,8008929
57972,8008929
57978,8008929
57979,8008929
57980,8008929
57982,8008929
57984,8008929
57986,8008929
57990,8008929
57991,8008929
57994,8008929
57995,8008929
57997,8008929
58004,8008929
58005,8008929
58010,8008929
58013,8008929
58014,8008929
58015,8008929
58017,8008929
58019,8008929
58025,8008929
58028,8008929
58032,8008929
58034,8008929
58035,8008929
58036,8008929
58037,8008929
58038,8008929
58039,8008929
58040,8008929
58044,8008929
58046,8008929
58054,8008929
58055,8008929
58058,8008929
58060,8008929
58061,8008929
58064,8008929
58065,8008929
58068,8008929
58069,8008929
58071,8008929
58072,8008929
58074,8008929
59098,8008929
59099,8008929
59827,8008929
59828,8008929
60156,8008929
61564,8008929
62194,8008929
64143,8008929
64144,8008929
64148,8008929
64153,8008929
64154,8008929
64155,8008929
64162,8008929
64163,8008929
67927,8008929
67928,8008929
67929,8008929
67930,8008929
67931,8008929
67932,8008929
67933,8008929
67934,8008929
67935,8008929
67936,8008929
67937,8008929
67941,8008929
67942,8008929
67943,8008929
68249,8008929
68251,8008929
68256,8008929
68258,8008929
68259,8008929
70439,8008929
70440,8008929
70443,8008929
70824,8008929
70834,8008929
70835,8008929
70837,8008929
70845,8008929
71158,8008929
71159,8008929
72643,8008929
79579,8008929
79580,8008929
79582,8008929
79583,8008929
79584,8008929
79585,8008929
79586,8008929
79849,8008929
80725,8008929
80727,8008929
80729,8008929
80730,8008929
81524,8008929
81629,8008929
81702,8008929
81703,8008929
82639,8008929
82702,8008929
83263,8008929
83264,8008929
83265,8008929
83267,8008929
83268,8008929
83269,8008929
83270,8008929
83272,8008929
92506,8008929
92507,8008929
92508,8008929
92509,8008929
92511,8008929
92514,8008929
92515,8008929
92518,8008929
92519,8008929
95859,8008929
96034,8008929
96035,8008929
96037,8008929
96040,8008929
96041,8008929
97198,8008929
97199,8008929
97200,8008929
97202,8008929
97203,8008929
97300,8008929
97303,8008929
98304,8008929
98345,8008929
99407,8008929
99417,8008929
99418,8008929
99419,8008929
99420,8008929
99424,8008929
99425,8008929
99426,8008929
99428,8008929
99430,8008929
99432,8008929
99433,8008929
99436,8008929
99442,8008929
99443,8008929
99444,8008929
99445,8008929
99446,8008929
170541,8012115
171692,8012115
163036,8008930
167639,8008930
170034,8008930
170535,8008930
170537,8008930
170539,8008930
168866,8009880
168877,8009880
79967,8009880
92481,8009880
103754,8009766
168930,8009766
169030,8009766
169285,8009766
169287,8009766
169810,8009766
170220,8009766
170568,8009766
170580,8009766
171066,8009766
171072,8009766
171074,8009766
171176,8009766
171451,8009766
171774,8009766
172072,8009766
172537,8009766`;

      function buildPromoMap(csvText) {
        const map = {};
        if (!csvText || typeof csvText !== 'string') return map;
        const lines = csvText.split(/\r?\n/);
        for (let i = 1; i < lines.length; i++) { // skip header
          const line = lines[i].trim();
          if (!line) continue;
          const parts = line.split(',');
          if (parts.length < 2) continue;
          const promo = parts[0].trim();
          const sales = parts[1].trim();
          if (!promo || !sales) continue;
          promoToSalesCodeMap[promo] = sales; // last occurrence wins
        }
      }

      buildPromoMap(csvMappingData);
 
      // Defaults
      let salescode = '8008926';
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
      let buyflowUrl = `https://px-demo-ordering.lumen.com/index?salescode=${updatedValues.salescode}&partnerId=clearlink${
            updatedValues.clearlinkeventid ? `&acsid=${updatedValues.clearlinkeventid}` : ''
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
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem;
                  padding-left: 2.75rem;
                  padding-right: 48px;
                  box-shadow: none;
                  margin-top: 24px;
                  position: relative;
                  z-index: 9999 !important;
                  pointer-events: auto !important;
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
              ">
                  <span class="button-text css-2qtueq e1hk20aw0" style="
                      font-weight: 500;
                      font-size: calc(0.5555555555555556vw + 17.333333333333332px);
                      line-height: calc(1.1111111111111112vw + 18.666666666666668px);
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
          buyflowUrl = `https://px-demo-ordering.lumen.com/index?salescode=${updatedValues.salescode}&partnerId=clearlink${
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