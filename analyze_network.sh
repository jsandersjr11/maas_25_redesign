#!/bin/bash

# Function to test a zip code with detailed headers and response capture
test_zip_detailed() {
  local zip=$1
  echo "Testing zip code: $zip"
  
  # Create a temporary file for headers
  local headers_file=$(mktemp)
  
  # Use curl with verbose output to capture all headers and request/response details
  curl -s -v -H "Accept: application/json" \
       -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36" \
       -H "Referer: https://www.brightspeedplans.com/availability/tx" \
       "https://www.brightspeedplans.com/api/availability?zip=$zip" \
       2>"$headers_file" | jq . 2>/dev/null || echo "Invalid JSON response"
  
  # Display headers for analysis
  echo "Request/Response Headers:"
  cat "$headers_file"
  
  # Clean up
  rm -f "$headers_file"
  echo "-----------------------------------"
}

# Test a few known Texas zip codes
echo "Testing known Texas zip codes..."
test_zip_detailed "75001" # Addison, TX
test_zip_detailed "77001" # Houston, TX
test_zip_detailed "78701" # Austin, TX
test_zip_detailed "76827" # One of the previously found Texas zip codes
test_zip_detailed "77383" # The other previously found Texas zip code

# Try to find the JavaScript validation function
echo "Searching for zip code validation functions in JavaScript files..."
curl -s "https://www.brightspeedplans.com/app-4a2d9e83f2a576827493.js" | grep -A 10 -B 10 "validateZip\|zipCode\|isValid" > zip_validation_functions.txt

echo "Validation functions extracted to zip_validation_functions.txt"

# Try to intercept form submission
echo "Analyzing form submission process..."
curl -s "https://www.brightspeedplans.com/availability/tx" | grep -A 10 -B 10 "<form" > form_analysis.txt

echo "Form analysis saved to form_analysis.txt"
