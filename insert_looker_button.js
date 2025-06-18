// Function to check if element exists and process it
function processElement() {
  console.log('Attempting to find element with data-qa="hosoyiruza"...');
  const element = document.querySelector('[data-qa="hosoyiruza"]');
  
  if (element && element.textContent) {
    console.log('Found element with data-qa="hosoyiruza"');
    
    // Extract dates
    let date1 = null;
    let date2 = null;
    const dateStrings = element.textContent.split(' - ');
    date1 = dateStrings[0] ? dateStrings[0].trim() : null;
    date2 = dateStrings[1] ? dateStrings[1].trim() : null;
    
    // Continue with the rest of the script
    processScript(date1, date2);
  } else {
    // Element not found yet, try again after a short delay
    console.log('Waiting for element with data-qa="hosoyiruza" to appear...');
    setTimeout(processElement, 500); // Check again after 500ms
  }
}

// Start checking for the element
processElement();

// Main processing function that runs after element is found
function processScript(date1, date2) {
  const formatAndEncodeDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null; // Check for invalid date
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}%2F${month}%2F${day}`;
    } catch (e) {
      console.error("Error parsing or formatting date:", e);
      return null;
    }
  };

  const formattedDate1 = formatAndEncodeDate(date1);
  const formattedDate2 = formatAndEncodeDate(date2);

  console.log('Formatted Date 1:', formattedDate1);
  console.log('Formatted Date 2:', formattedDate2);

  const currentUrl = window.location.href;
  let extractedNumber = null;

  try {
    const afterAb = currentUrl.split('ab/')[1];
    if (afterAb) {
      const beforeReport = afterAb.split('/report')[0];
      if (beforeReport) {
        const numberMatch = beforeReport.match(/\d+/);
        if (numberMatch && numberMatch[0]) {
          extractedNumber = parseInt(numberMatch[0], 10);
        }
      }
    }
  } catch (e) {
    console.error('Error parsing URL:', e);
  }

  console.log('Extracted Number:', extractedNumber);

  // build url that includes all of the following variables
  var lookerUrl = "https://clearlink.cloud.looker.com/dashboards/1926?Brand=&Channel=&Language+Marketed=&Dynamic+Metric+Picker=Leads&Paid+Channel+Account=&Paid+Channel+Campaign=&Promo+Code=&Paid+Channel+Provider=&Table+Date+Grouping=No+Date+Grouping&Graph+Date+Grouping=Date&Date+Range="+formattedDate1+"+to+"+formattedDate2+"&Domain+-+Landing+Page=&Experiment+ID="+extractedNumber+"&Variation+ID="

  // Wait for the button container to be available as well
  waitForButtonContainer(lookerUrl);
}

// Function to wait for button container and inject the button
function waitForButtonContainer(lookerUrl) {
  const buttonContainer = document.querySelector('.Mb\\(10px\\).D\\(f\\).Ai\\(c\\).W\\(100\\%\\)');
  
  if (buttonContainer) {
    console.log('Found button container, injecting Looker button');
    const htmlToInject = `<a type="button" target="_blank" href="`+lookerUrl+`" class="btn btn--neutral" style="
        margin-left: auto;
    ">  <span data-qa="duvesutuxo">Review in Looker</span> </a>`;
    
    buttonContainer.insertAdjacentHTML('beforeend', htmlToInject);
    console.log('Successfully injected Looker button');
  } else {
    // Button container not found yet, try again after a short delay
    console.log('Waiting for button container to appear...');
    setTimeout(() => waitForButtonContainer(lookerUrl), 500); // Check again after 500ms
  }
}