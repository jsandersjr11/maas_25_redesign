// Zip code demographic insights generator
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

// Create output directory for demographic insights
async function ensureOutputDir() {
  const outputDir = path.join(__dirname, 'zip_demographic_insights');
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
  return outputDir;
}

// Generate demographic insights for each zip code
async function generateDemographicInsights() {
  const results = [];
  const outputDir = await ensureOutputDir();
  
  console.log(`Starting demographic insights generation for ${zipCodes.length} zip codes...`);
  
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
    // Use the m.clear.link URL for demographic data
    const url = `https://m.clear.link/zip_code/${zipData.zip}`;
    console.log(`Gathering demographic data for ${zipData.zip} (${zipData.tier}, ${zipData.state})...`);
    
    try {
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // Extract demographic data
      const demographicData = await extractDemographicData(page, zipData);
      
      // Take a screenshot
      const screenshotPath = path.join(outputDir, `demographic_${zipData.zip}.png`);
      await page.screenshot({ path: screenshotPath });
      demographicData.screenshotPath = screenshotPath;
      
      results.push(demographicData);
      console.log(`Completed demographic insights for ${zipData.zip}`);
      
    } catch (error) {
      console.error(`Error gathering demographic data for ${zipData.zip}:`, error);
      results.push({
        zip: zipData.zip,
        tier: zipData.tier,
        state: zipData.state,
        serviceability: zipData.serviceability,
        error: error.toString()
      });
    }
  }
  
  // Close the browser when done
  await browser.close();
  
  // Save results to file
  const resultsPath = path.join(outputDir, 'demographic_insights.json');
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${resultsPath}`);
  
  // Generate report
  const reportPath = path.join(outputDir, 'demographic_insights_report.md');
  const report = generateInsightsReport(results);
  await fs.writeFile(reportPath, report);
  console.log(`Report saved to ${reportPath}`);
  
  return results;
}

// Extract demographic data from the page
async function extractDemographicData(page, zipData) {
  const data = {
    zip: zipData.zip,
    tier: zipData.tier,
    state: zipData.state,
    serviceability: zipData.serviceability,
    demographics: {}
  };
  
  try {
    // Extract demographic data from m.clear.link
    data.demographics = await page.evaluate(() => {
      const demographics = {};
      
      // Get all the text content from the page
      const pageText = document.body.innerText;
      
      // Population
      try {
        const populationMatch = pageText.match(/Population:\s*([\d,]+)/);
        if (populationMatch && populationMatch[1]) {
          demographics.population = populationMatch[1].replace(/,/g, '');
        }
      } catch (e) {
        demographics.populationError = e.toString();
      }
      
      // Median Age
      try {
        const ageMatch = pageText.match(/Median Age:\s*([\d.]+)/);
        if (ageMatch && ageMatch[1]) {
          demographics.medianAge = ageMatch[1];
        }
      } catch (e) {
        demographics.medianAgeError = e.toString();
      }
      
      // Household Income
      try {
        const incomeMatch = pageText.match(/Average Household Income:\s*\$(\d[\d,]+)/);
        if (incomeMatch && incomeMatch[1]) {
          demographics.householdIncome = '$' + incomeMatch[1];
        }
      } catch (e) {
        demographics.incomeError = e.toString();
      }
      
      // Home Value
      try {
        const homeValueMatch = pageText.match(/Average House Value:\s*\$(\d[\d,]+)/);
        if (homeValueMatch && homeValueMatch[1]) {
          demographics.homeValue = '$' + homeValueMatch[1];
        }
      } catch (e) {
        demographics.homeValueError = e.toString();
      }
      
      // Household Size
      try {
        const householdSizeMatch = pageText.match(/Average Household Size:\s*([\d.]+)/);
        if (householdSizeMatch && householdSizeMatch[1]) {
          demographics.householdSize = householdSizeMatch[1];
        }
      } catch (e) {
        demographics.householdSizeError = e.toString();
      }
      
      // Population Growth
      try {
        const growthMatch = pageText.match(/Growth Rank:\s*(\d+)\s*\(([-+]?[\d.]+%)\)/);
        if (growthMatch && growthMatch[1] && growthMatch[2]) {
          demographics.growthRank = growthMatch[1];
          demographics.populationGrowth = growthMatch[2];
        }
      } catch (e) {
        demographics.growthError = e.toString();
      }
      
      // Business Count
      try {
        const businessMatch = pageText.match(/Businesses:\s*(\d+)\s*\((\d+)\s*employees\)/);
        if (businessMatch && businessMatch[1] && businessMatch[2]) {
          demographics.businessCount = businessMatch[1];
          demographics.employeeCount = businessMatch[2];
        }
      } catch (e) {
        demographics.businessError = e.toString();
      }
      
      return demographics;
    });
  } catch (e) {
    data.extractionError = e.toString();
  }
  
  return data;
}

// Generate insights report
function generateInsightsReport(results) {
  let report = '# Zip Code Demographic Insights Report\n\n';
  
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
  
  // Generate insights for each zip code
  report += '## Individual Zip Code Insights\n\n';
  
  results.forEach(result => {
    report += `### Zip Code ${result.zip} (${result.tier}, ${result.state})\n\n`;
    report += `**Service Availability:** ${result.serviceability}\n\n`;
    
    if (result.error) {
      report += `*Error retrieving demographic data: ${result.error}*\n\n`;
    } else if (result.demographics) {
      const d = result.demographics;
      
      report += '#### Targeting Customer Needs and Preferences\n\n';
      
      // Population
      if (d.population) {
        report += `**Population:** ${d.population}\n\n`;
      }
      
      // Household Size
      if (d.householdSize) {
        const householdSizeNum = parseFloat(d.householdSize);
        const householdSizeComparison = householdSizeNum > 2.6 ? 'higher' : 'lower';
        report += `**Average household size:** ${d.householdSize} persons per household, which is ${householdSizeComparison} than the U.S. national average of around 2.6. `;
        
        if (householdSizeNum > 3.0) {
          report += 'This indicates larger families with more devices needing a connection, making a high-speed, reliable internet connection a critical need. You should highlight plans with ample bandwidth and support for multiple connected devices.\n\n';
        } else if (householdSizeNum < 2.3) {
          report += 'This suggests smaller households or more single-person homes, which may prioritize cost-effectiveness over maximum bandwidth. Focus on reliable, moderate-speed plans with competitive pricing.\n\n';
        } else {
          report += 'This represents average-sized households that need reliable internet for typical usage patterns. Balanced plans offering good value and reliable performance would appeal to this demographic.\n\n';
        }
      }
      
      // Income and Home Value
      if (d.householdIncome && d.homeValue) {
        report += `**Income and Home Value:** With ${d.householdIncome} average household income and ${d.homeValue} average house value, `;
        
        if (d.householdIncome.includes('$75,000') || parseInt(d.householdIncome.replace(/[^0-9]/g, '')) > 75000) {
          report += 'this population can afford premium internet services. Instead of focusing on budget-friendly options, you can emphasize higher-tier plans, bundles, and advanced features like whole-home Wi-Fi or symmetrical speeds.\n\n';
        } else {
          report += 'this population may be more price-conscious. Emphasize value-oriented plans and clear pricing without hidden fees. Promotional offers and bundle discounts may be particularly effective here.\n\n';
        }
      }
      
      // Median Age
      if (d.medianAge) {
        const ageNum = parseFloat(d.medianAge);
        report += `**Median Age:** ${d.medianAge} years. `;
        
        if (ageNum < 30) {
          report += 'This is a relatively young population. This demographic is typically tech-savvy and values fast, low-latency connections for gaming, streaming, and online learning. Marketing should focus on performance metrics like gigabit speeds and low ping, rather than just basic connectivity.\n\n';
        } else if (ageNum > 50) {
          report += 'This indicates an older population that may prioritize reliability and customer service over cutting-edge speeds. Focus on ease of use, consistent performance, and excellent customer support in your marketing materials.\n\n';
        } else {
          report += 'This represents a mixed-age population with diverse needs. A variety of plan options with clear explanations of benefits would work well here, along with messaging that emphasizes both performance and reliability.\n\n';
        }
      }
      
      // Population Growth
      if (d.populationGrowth) {
        report += `**Population Growth:** ${d.populationGrowth}. `;
        
        if (d.populationGrowth.includes('+')) {
          report += 'This suggests a growing area with potential for new customer acquisition. You can proactively target new construction developments and recently moved-in residents with special offers or move-in bundles.\n\n';
        } else if (d.populationGrowth.includes('-')) {
          report += 'This area is experiencing population decline, suggesting a focus on customer retention rather than acquisition. Loyalty programs and excellent service should be prioritized to maintain your customer base.\n\n';
        } else {
          report += 'The population appears stable, indicating a balanced approach to both customer acquisition and retention would be appropriate.\n\n';
        }
      }
      
      report += '#### Optimizing Communication and Service Delivery\n\n';
      
      // Dominant Communication Channels
      if (d.medianAge) {
        const ageNum = parseFloat(d.medianAge);
        report += '**Dominant Communication Channels:** ';
        
        if (ageNum < 30) {
          report += 'Given the young median age, digital marketing channels like social media (Instagram, TikTok), online forums, and targeted digital ads will likely be more effective than traditional methods like print ads.\n\n';
        } else if (ageNum > 50) {
          report += 'With an older population, a mix of digital and traditional marketing channels would be effective. Consider Facebook, email marketing, and even direct mail or local newspaper advertising.\n\n';
        } else {
          report += 'A diverse age population requires a multi-channel approach. Utilize a mix of social media platforms, email marketing, and targeted digital advertising to reach different segments effectively.\n\n';
        }
      }
      
      // Sales and Support Strategy
      report += '**Sales and Support Strategy:** ';
      
      if (d.householdIncome && d.householdIncome.includes('$75,000') || (d.householdIncome && parseInt(d.householdIncome.replace(/[^0-9]/g, '')) > 75000)) {
        report += 'This higher-income area likely values premium service and expertise. Your sales and customer support teams should be well-versed in addressing technical questions and providing white-glove service. The focus should be on providing expert advice rather than a generic sales pitch.\n\n';
      } else {
        report += 'This area may be more price-sensitive, so sales teams should emphasize value, transparent pricing, and cost-saving bundles. Customer support should be efficient and straightforward, focusing on quick resolution of issues.\n\n';
      }
      
      // Partnerships
      if (d.businessCount) {
        report += `**Partnerships:** With ${d.businessCount} businesses in the area, `;
        report += 'this presents an opportunity to develop B2B internet service offerings. Consider creating a separate product line to serve the business community in this area. You can also explore partnerships with local real estate agencies or home builders to offer internet services as part of a new home package.\n\n';
      }
    }
  });
  
  // Tier-based insights
  report += '## Tier-Based Insights\n\n';
  
  for (const [tier, tierResults] of Object.entries(tierGroups)) {
    report += `### Tier ${tier} (${tierResults.length} zip codes)\n\n`;
    
    // Calculate averages
    const averages = calculateAverages(tierResults);
    
    report += `**Average Serviceability:** ${averages.serviceability}%\n\n`;
    
    if (averages.medianAge) {
      report += `**Average Median Age:** ${averages.medianAge} years\n\n`;
    }
    
    if (averages.householdSize) {
      report += `**Average Household Size:** ${averages.householdSize} persons\n\n`;
    }
    
    // Generate tier-specific recommendations
    report += '**Marketing Recommendations:**\n\n';
    
    if (tier === 'L1') {
      report += '- Focus on reliability and value rather than maximum speeds\n';
      report += '- Emphasize clear pricing and no hidden fees\n';
      report += '- Highlight customer service and support quality\n\n';
    } else if (tier === 'L3') {
      report += '- Balance speed and value messaging\n';
      report += '- Promote mid-tier plans with good price-to-performance ratio\n';
      report += '- Emphasize reliability for work-from-home scenarios\n\n';
    } else if (tier.startsWith('M')) {
      report += '- Highlight premium speeds and advanced features\n';
      report += '- Promote whole-home Wi-Fi solutions and smart home capabilities\n';
      report += '- Emphasize future-proof technology and upgradability\n\n';
    }
  }
  
  // State-based insights
  report += '## State-Based Insights\n\n';
  
  for (const [state, stateResults] of Object.entries(stateGroups)) {
    report += `### ${state} (${stateResults.length} zip codes)\n\n`;
    
    // Calculate averages
    const averages = calculateAverages(stateResults);
    
    report += `**Average Serviceability:** ${averages.serviceability}%\n\n`;
    
    if (averages.medianAge) {
      report += `**Average Median Age:** ${averages.medianAge} years\n\n`;
    }
    
    if (averages.householdSize) {
      report += `**Average Household Size:** ${averages.householdSize} persons\n\n`;
    }
    
    // Generate state-specific recommendations
    report += '**Marketing Recommendations:**\n\n';
    
    if (state === 'NJ') {
      report += '- Focus on areas with confirmed service availability\n';
      report += '- Create clear messaging about service boundaries\n';
      report += '- Develop special campaigns for newly serviced areas\n\n';
    } else if (['TX', 'MO', 'AL'].includes(state)) {
      report += '- Leverage high service availability in marketing messages\n';
      report += '- Create state-specific landing pages highlighting local testimonials\n';
      report += '- Partner with local businesses for co-marketing opportunities\n\n';
    } else {
      report += '- Develop regionally relevant messaging and imagery\n';
      report += '- Highlight community involvement and local support\n';
      report += '- Create targeted campaigns based on regional internet usage patterns\n\n';
    }
  }
  
  report += '## Conclusion\n\n';
  report += 'This demographic analysis provides a foundation for creating highly targeted marketing campaigns and optimizing landing pages for each zip code area. By tailoring your messaging to the specific needs and characteristics of each community, you can significantly improve conversion rates and customer satisfaction.\n\n';
  
  return report;
}

// Calculate averages from results
function calculateAverages(results) {
  const averages = {
    serviceability: 0,
    medianAge: 0,
    householdSize: 0,
    householdIncome: 0,
    homeValue: 0
  };
  
  let serviceabilityCount = 0;
  let medianAgeCount = 0;
  let householdSizeCount = 0;
  
  results.forEach(result => {
    // Serviceability
    if (result.serviceability) {
      const serviceabilityValue = parseInt(result.serviceability);
      if (!isNaN(serviceabilityValue)) {
        averages.serviceability += serviceabilityValue;
        serviceabilityCount++;
      }
    }
    
    // Demographics
    if (result.demographics) {
      // Median Age
      if (result.demographics.medianAge) {
        const ageValue = parseFloat(result.demographics.medianAge);
        if (!isNaN(ageValue)) {
          averages.medianAge += ageValue;
          medianAgeCount++;
        }
      }
      
      // Household Size
      if (result.demographics.householdSize) {
        const sizeValue = parseFloat(result.demographics.householdSize);
        if (!isNaN(sizeValue)) {
          averages.householdSize += sizeValue;
          householdSizeCount++;
        }
      }
    }
  });
  
  // Calculate final averages
  if (serviceabilityCount > 0) {
    averages.serviceability = (averages.serviceability / serviceabilityCount).toFixed(1);
  }
  
  if (medianAgeCount > 0) {
    averages.medianAge = (averages.medianAge / medianAgeCount).toFixed(1);
  }
  
  if (householdSizeCount > 0) {
    averages.householdSize = (averages.householdSize / householdSizeCount).toFixed(2);
  }
  
  return averages;
}

// Execute the function when run directly
if (require.main === module) {
  generateDemographicInsights()
    .then(() => console.log('Demographic insights generation completed successfully!'))
    .catch(err => {
      console.error('Error during demographic insights generation:', err);
      process.exit(1);
    });
}

module.exports = { generateDemographicInsights };
