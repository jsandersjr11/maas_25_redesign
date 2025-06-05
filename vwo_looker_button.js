const element = document.querySelector('.filter-box-header-option-title.ng-binding');
let date1 = null;
let date2 = null;

if (element && element.textContent) {
  const dateStrings = element.textContent.split(' - ');
  date1 = dateStrings[0] ? dateStrings[0].trim() : null;
  date2 = dateStrings[1] ? dateStrings[1].trim() : null;
}

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

const buttonContainer = document.querySelector('.Mb\\(10px\\).D\\(f\\).Ai\\(c\\).W\\(100\\%\\)');
const htmlToInject = `<a type="button" href="`+lookerUrl+`" class="btn btn--neutral" style="
    margin-left: auto;
">  <span data-qa="duvesutuxo">Review in Looker</span> </a>`;
if (buttonContainer) {
    buttonContainer.insertAdjacentHTML('beforeend', htmlToInject);
}