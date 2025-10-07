// Zip code checker script using standalone Playwright
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const zipCodes = [
  { zip: '75751', tier: 'L1', state: 'TX', serviceability: '53%' },
  { zip: '76522', tier: 'L1', state: 'TX', serviceability: '44%' },
  { zip: '8844', tier: 'L1', state: 'NJ', serviceability: '29%' },
  { zip: '76559', tier: 'L1', state: 'TX', serviceability: '68%' },
  { zip: '63366', tier: 'L1', state: 'MO', serviceability: '13%' },
  { zip: '38654', tier: 'L1', state: 'MS', serviceability: '10%' },
  { zip: '63376', tier: 'L1', state: 'MO', serviceability: '10%' },
  { zip: '7871', tier: 'L1', state: 'NJ', serviceability: '45%' },
  { zip: '76401', tier: 'L3', state: 'TX', serviceability: '36%' },
  { zip: '36323', tier: 'M1', state: 'AL', serviceability: '38%' },
  { zip: '8825', tier: 'M1', state: 'NJ', serviceability: '21%' },
  { zip: '36567', tier: 'M1', state: 'AL', serviceability: '37%' },
  { zip: '36576', tier: 'M1', state: 'AL', serviceability: '11%' },
  { zip: '71378', tier: 'M1', state: 'LA', serviceability: '48%' },
  { zip: '36420', tier: 'M2', state: 'AL', serviceability: '48%' },
  { zip: '36421', tier: 'M2', state: 'AL', serviceability: '15%' },
  { zip: '36340', tier: 'M2', state: 'AL', serviceability: '69%' },
  { zip: '78634', tier: 'M2', state: 'TX', serviceability: '12%' },
  { zip: '36467', tier: 'M2', state: 'AL', serviceability: '45%' },
  { zip: '63461', tier: 'M2', state: 'MO', serviceability: '56%' },
  { zip: '65775', tier: 'M2', state: 'MO', serviceability: '36%' },
  { zip: '65360', tier: 'M2', state: 'MO', serviceability: '43%' },
  { zip: '63435', tier: 'M3', state: 'MO', serviceability: '47%' },
  { zip: '35054', tier: 'M3', state: 'AL', serviceability: '57%' },
  { zip: '72834', tier: 'M3', state: 'AR', serviceability: '38%' },
  { zip: '72046', tier: 'M3', state: 'AR', serviceability: '54%' },
  { zip: '64644', tier: 'M3', state: 'MO', serviceability: '38%' },
  { zip: '72366', tier: 'M3', state: 'AR', serviceability: '62%' },
  { zip: '65712', tier: 'M3', state: 'MO', serviceability: '35%' },
  { zip: '65711', tier: 'M3', state: 'MO', serviceability: '42%' },
  { zip: '71465', tier: 'M3', state: 'LA', serviceability: '50%' },
  { zip: '72855', tier: 'M3', state: 'AR', serviceability: '36%' },
  { zip: '35125', tier: 'M3', state: 'AL', serviceability: '37%' },
  { zip: '35128', tier: 'M3', state: 'AL', serviceability: '39%' },
  { zip: '72454', tier: 'M3', state: 'AR', serviceability: '65%' },
  { zip: '72461', tier: 'M3', state: 'AR', serviceability: '50%' },
  { zip: '35135', tier: 'M3', state: 'AL', serviceability: '13%' },
  { zip: '71075', tier: 'M3', state: 'LA', serviceability: '67%' },
  { zip: '35178', tier: 'M3', state: 'AL', serviceability: '10%' },
  { zip: '72958', tier: 'M3', state: 'AR', serviceability: '38%' },
  { zip: '70591', tier: 'M3', state: 'LA', serviceability: '61%' }
];

// Create output directory for screenshots and results
async function ensureOutputDir() {
  const outputDir = path.join(__dirname, 'zip_results');
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
  return outputDir;
}

// This function will check all zip codes using Playwright
async function checkZipCodes() {
  const results = [];
  const baseUrl = 'https://m.clear.link/zip_code/';
  const outputDir = await ensureOutputDir();
  
  console.log(`Starting zip code checks for ${zipCodes.length} zip codes...`);
  
  // Launch the browser
  const browser = await chromium.launch({
    headless: false // Set to true for headless mode
  });
  
  // Create a new context
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  });
  
  // Create a new page
  const page = await context.newPage();
  
  // Process each zip code
  for (const zipData of zipCodes) {
    const url = `${baseUrl}${zipData.zip}`;
    console.log(`Checking ${zipData.zip} (${zipData.tier}, ${zipData.state}, Serviceability: ${zipData.serviceability})...`);
    
    try {
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Get the page content
      const html = await page.content();
      
      // Get the visible text content
      const textContent = await page.evaluate(() => document.body.innerText);
      
      // Extract relevant data
      const pageData = {
        zip: zipData.zip,
        tier: zipData.tier,
        state: zipData.state,
        originalServiceability: zipData.serviceability,
        textContent: textContent.substring(0, 500), // First 500 chars of text
        // Extract specific data points from the page
        extractedData: await extractDataFromPage(page)
      };
      
      // Take a screenshot
      const screenshotPath = path.join(outputDir, `zip_${zipData.zip}.png`);
      await page.screenshot({ path: screenshotPath });
      pageData.screenshotPath = screenshotPath;
      
      results.push(pageData);
      console.log(`Completed check for ${zipData.zip}`);
      
    } catch (error) {
      console.error(`Error checking ${zipData.zip}:`, error);
      results.push({
        zip: zipData.zip,
        tier: zipData.tier,
        state: zipData.state,
        originalServiceability: zipData.serviceability,
        error: error.toString()
      });
    }
  }
  
  // Close the browser when done
  await browser.close();
  
  // Save results to file
  const resultsPath = path.join(outputDir, 'results.json');
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${resultsPath}`);
  
  // Generate report
  const reportPath = path.join(outputDir, 'report.txt');
  const report = generateReport(results);
  await fs.writeFile(reportPath, report);
  console.log(`Report saved to ${reportPath}`);
  
  return results;
}

// Extract specific data from the page
async function extractDataFromPage(page) {
  return await page.evaluate(() => {
    const data = {};
    
    // Try to extract service availability information
    try {
      // Look for text containing "available" or "not available"
      const bodyText = document.body.innerText.toLowerCase();
      data.serviceAvailable = bodyText.includes('available');
      
      // Try to extract speeds if available
      const speedMatches = bodyText.match(/(\d+)\s*mbps|\s*(\d+)\s*gig/gi);
      if (speedMatches) {
        data.speeds = speedMatches.map(s => s.trim());
      }
      
      // Try to extract pricing information
      const priceMatches = bodyText.match(/\$\d+(\.\d+)?/g);
      if (priceMatches) {
        data.prices = priceMatches.map(p => p.trim());
      }
    } catch (e) {
      data.extractionError = e.toString();
    }
    
    return data;
  });
}

function generateReport(results) {
  let report = '=== ZIP CODE CHECK REPORT ===\n\n';
  report += `Total zip codes checked: ${results.length}\n`;
  
  const successfulChecks = results.filter(r => !r.error).length;
  report += `Successful checks: ${successfulChecks}\n`;
  report += `Failed checks: ${results.length - successfulChecks}\n\n`;
  
  // Group by tier
  const tierGroups = {};
  results.forEach(result => {
    if (!tierGroups[result.tier]) {
      tierGroups[result.tier] = [];
    }
    tierGroups[result.tier].push(result);
  });
  
  // Group by state
  const stateGroups = {};
  results.forEach(result => {
    if (!stateGroups[result.state]) {
      stateGroups[result.state] = [];
    }
    stateGroups[result.state].push(result);
  });
  
  // Report by tier
  report += '\n=== RESULTS BY TIER ===\n';
  for (const [tier, tierResults] of Object.entries(tierGroups)) {
    report += `\nTier ${tier} (${tierResults.length} zip codes):\n`;
    
    const serviceAvailable = tierResults.filter(r => r.extractedData?.serviceAvailable).length;
    const serviceRate = ((serviceAvailable / tierResults.length) * 100).toFixed(1);
    report += `Service availability rate: ${serviceRate}%\n`;
    
    // List zip codes in this tier
    report += `Zip codes: ${tierResults.map(r => r.zip).join(', ')}\n`;
  }
  
  // Report by state
  report += '\n=== RESULTS BY STATE ===\n';
  for (const [state, stateResults] of Object.entries(stateGroups)) {
    report += `\nState ${state} (${stateResults.length} zip codes):\n`;
    
    const serviceAvailable = stateResults.filter(r => r.extractedData?.serviceAvailable).length;
    const serviceRate = ((serviceAvailable / stateResults.length) * 100).toFixed(1);
    report += `Service availability rate: ${serviceRate}%\n`;
    
    // List zip codes in this state
    report += `Zip codes: ${stateResults.map(r => r.zip).join(', ')}\n`;
  }
  
  // Detailed results
  report += '\n=== DETAILED RESULTS ===\n';
  results.forEach(result => {
    report += `\nZip: ${result.zip} (${result.tier}, ${result.state})\n`;
    report += `Original Serviceability: ${result.originalServiceability}\n`;
    
    if (result.error) {
      report += `Error: ${result.error}\n`;
    } else {
      if (result.extractedData) {
        report += `Service Available: ${result.extractedData.serviceAvailable ? 'Yes' : 'No'}\n`;
        
        if (result.extractedData.speeds) {
          report += `Speeds: ${result.extractedData.speeds.join(', ')}\n`;
        }
        
        if (result.extractedData.prices) {
          report += `Prices: ${result.extractedData.prices.join(', ')}\n`;
        }
      }
      
      report += `Screenshot: ${result.screenshotPath}\n`;
    }
  });
  
  report += '\n=== PPC LANDING PAGE OPTIMIZATION RECOMMENDATIONS ===\n\n';
  report += 'Based on the data collected, here are recommendations for optimizing PPC landing pages:\n\n';
  
  // Generate recommendations based on the data
  report += '1. Geographic Targeting:\n';
  report += '   - Focus PPC spend on states with higher service availability rates\n';
  report += '   - Consider different ad messaging for areas with lower availability\n\n';
  
  report += '2. Tier-Based Optimization:\n';
  report += '   - Create specific landing pages for different tier groups\n';
  report += '   - Adjust bidding strategy based on tier performance\n\n';
  
  report += '3. Speed and Price Messaging:\n';
  report += '   - Highlight the most common speeds available in ad copy\n';
  report += '   - Emphasize competitive pricing where applicable\n\n';
  
  report += '4. Landing Page Content:\n';
  report += '   - Ensure landing pages clearly communicate service availability\n';
  report += '   - Include prominent zip code checkers on landing pages\n';
  report += '   - Customize content based on tier and state data\n\n';
  
  report += '=== END OF REPORT ===\n';
  
  return report;
}

// Execute the function when run directly
if (require.main === module) {
  checkZipCodes()
    .then(() => console.log('Zip code checking completed successfully!'))
    .catch(err => {
      console.error('Error during zip code checking:', err);
      process.exit(1);
    });
}

module.exports = { checkZipCodes };
