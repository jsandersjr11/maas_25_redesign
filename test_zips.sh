#!/bin/bash
# Script to test Texas zip codes against Brightspeed website
# Texas zip codes start with 75-79

# Create a file with some sample Texas zip codes to test
cat > texas_sample_zips.txt << EOL
75001
75002
76001
76002
77001
77002
78001
78002
79001
79002
EOL

echo "Testing sample Texas zip codes..."
for zip in $(cat texas_sample_zips.txt); do
  echo "Testing zip code: $zip"
  response=$(curl -s "https://www.brightspeedplans.com/api/availability?zip=$zip")
  if [[ $response == *"available"* ]]; then
    echo "$zip: VALID - Service available"
  elif [[ $response == *"unavailable"* ]]; then
    echo "$zip: VALID - Service unavailable"
  else
    echo "$zip: UNKNOWN - Unexpected response"
    echo "Response: $response"
  fi
  sleep 1
done
