#!/bin/bash

# Create directory for downloaded files
mkdir -p brightspeed_files

# Download main JavaScript files
echo "Downloading main JavaScript files..."
curl -s "https://www.brightspeedplans.com/app-4a2d9e83f2a576827493.js" -o brightspeed_files/app.js
curl -s "https://www.brightspeedplans.com/component---src-templates-dynamic-zip-packages-jsx-0e3d96ed00ccda4433b8.js" -o brightspeed_files/zip_packages.js
curl -s "https://www.brightspeedplans.com/component---src-templates-state-jsx-a998a3ee3171370f8f42.js" -o brightspeed_files/state.js

# Function to test a zip code against the API
test_zip() {
  local zip=$1
  local response=$(curl -s -H "Accept: application/json" "https://www.brightspeedplans.com/api/availability?zip=$zip")
  
  # Check if the response contains valid JSON
  if echo "$response" | jq -e . >/dev/null 2>&1; then
    # Extract availability status
    local status=$(echo "$response" | jq -r '.available // .unavailable // "unknown"')
    echo "$zip: $status"
    return 0
  else
    echo "$zip: Invalid response"
    return 1
  fi
}

# Create a file with Texas zip code ranges
echo "Generating Texas zip code test ranges..."
echo "Texas zip codes generally start with 75-79"

# Test a small sample of zip codes from each Texas prefix
echo "Testing sample zip codes from each Texas prefix..."
for prefix in 75 76 77 78 79; do
  for i in {0..9}; do
    for j in {0..9}; do
      # Test only a few zip codes per prefix to avoid overwhelming the server
      if [ $j -le 2 ]; then
        zip="${prefix}${i}${j}0"
        echo "Testing $zip..."
        test_zip "$zip"
        sleep 1
      fi
    done
  done
done

# Alternative approach: Extract potential zip codes from JavaScript files
echo "Extracting potential zip codes from downloaded JavaScript files..."
grep -o '[0-9]\{5\}' brightspeed_files/*.js | sort -u > extracted_zips.txt

# Filter for Texas zip codes (starting with 75-79)
echo "Filtering for Texas zip codes..."
grep '^7[5-9]' extracted_zips.txt > texas_zips.txt

echo "Potential Texas zip codes extracted to texas_zips.txt"
echo "Total extracted Texas zip codes: $(wc -l < texas_zips.txt)"

# Test the extracted Texas zip codes against the API
echo "Testing extracted Texas zip codes against the API..."
valid_zips=()
while read -r zip; do
  echo "Testing extracted zip: $zip"
  response=$(curl -s -H "Accept: application/json" "https://www.brightspeedplans.com/api/availability?zip=$zip")
  
  # Check if the response contains valid JSON
  if echo "$response" | jq -e . >/dev/null 2>&1; then
    # Check if the zip code is valid (either available or unavailable)
    if echo "$response" | jq -e '.available != null || .unavailable != null' >/dev/null 2>&1; then
      valid_zips+=("$zip")
      echo "$zip: VALID"
    else
      echo "$zip: INVALID"
    fi
  else
    echo "$zip: Error - Invalid response"
  fi
  sleep 1
done < texas_zips.txt

# Save valid zip codes to file
printf "%s\n" "${valid_zips[@]}" > valid_texas_zips.txt
echo "Valid Texas zip codes saved to valid_texas_zips.txt"
echo "Total valid Texas zip codes found: ${#valid_zips[@]}"
