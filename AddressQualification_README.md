# Address Qualification Script

This script transforms a zip code input field into an address input field with Radar Autocomplete functionality.

## Features

- **Automatic Field Modification**: Converts existing zip code input to address input
- **Radar Autocomplete**: Provides real-time address suggestions as users type
- **Address Validation**: Ensures users select a valid address from the suggestions
- **Data Extraction**: Parses and stores complete address components (street, city, state, zip, etc.)
- **Seamless Integration**: Designed to be injected into existing pages without breaking functionality
- **Cost Effective**: Radar offers competitive pricing compared to Google Maps

## Setup Instructions

### 1. Get a Radar Publishable Key

1. Go to [Radar](https://radar.com/signup) and sign up for a free account
2. Navigate to your dashboard
3. Copy your **Publishable Key** (starts with `prj_live_pk_`)
4. Free tier includes 100,000 requests/month
5. No credit card required for free tier

### 2. Configure the Script

Open `AddressQualificationScript.js` and replace the placeholder with your actual Radar key:

```javascript
const RADAR_PUBLISHABLE_KEY = 'prj_live_pk_YOUR_KEY_HERE'; // Replace with your actual Radar key
```

**Note**: The script already includes a demo key, but you should replace it with your own for production use.

### 3. Inject the Script

There are several ways to inject this script into your page:

#### Option A: Direct Script Tag (Development)
```html
<script src="AddressQualificationScript.js"></script>
```

#### Option B: Tag Manager (Recommended for Production)
1. Copy the entire script content
2. Create a new Custom HTML tag in Google Tag Manager
3. Wrap it in `<script>` tags
4. Set trigger to fire on the appropriate pages

#### Option C: Browser Console (Testing)
1. Copy the entire script content
2. Open browser developer tools (F12)
3. Paste into console and press Enter

#### Option D: Bookmarklet (Testing)
Create a bookmarklet with this code:
```javascript
javascript:(function(){var s=document.createElement('script');s.src='path/to/AddressQualificationScript.js';document.head.appendChild(s);})();
```

## How It Works

### 1. Container Preparation
The script finds the existing input group and prepares it:
- Hides the original zip code input
- Creates a new container for Radar autocomplete widget
- Maintains the existing layout and button

### 2. Radar Autocomplete
- Loads the Radar SDK (JavaScript and CSS)
- Initializes Radar autocomplete widget
- Restricts suggestions to US addresses
- Provides real-time suggestions as users type
- Uses Radar's built-in UI components

### 3. Address Selection
When a user selects an address:
- Extracts all address components (street, city, state, zip, etc.)
- Stores data in the input's `data-selectedAddress` attribute
- Adds visual validation (green border for valid address)

### 4. Form Submission
On form submission:
- Validates that an address was selected
- Formats the address for the URL parameter
- Redirects to `/cart?address=FORMATTED_ADDRESS`

## Address Data Structure

The script stores the following data when an address is selected:

```javascript
{
  formattedAddress: "123 Main St, Springfield, IL 62701, USA",
  street: "123 Main St",
  city: "Springfield",
  state: "IL",
  zip: "62701",
  country: "US",
  placeId: "ChIJ...",
  lat: 39.7817,
  lng: -89.6501
}
```

## Customization Options

### Restrict to Different Country
Change the country restriction in the script:
```javascript
countryCode: 'CA' // For Canada
countryCode: ['US', 'CA'] // For multiple countries
```

### Change Address Layers
Modify the layers parameter:
```javascript
layers: ['address'] // Only street addresses (default)
layers: ['place', 'address'] // Places and addresses
layers: ['postalCode'] // Postal codes
// Available: place, address, intersection, street, neighborhood, postalCode, locality, county, state, country
```

### Modify Redirect URL
Change the cart URL format:
```javascript
const cartUrl = `/cart?address=${encodeURIComponent(formattedAddress)}`;
// Change to:
const cartUrl = `/checkout?location=${encodeURIComponent(formattedAddress)}`;
```

### Custom Styling
The script includes default styles for the Radar autocomplete widget. Modify the `addCustomStyles()` function to customize:

```javascript
#radar-autocomplete-container .radar-autocomplete-input {
  padding: 12px !important;
  border: 1px solid #ccc !important;
  /* Add your custom styles */
}
```

## Troubleshooting

### Script Not Working
1. Check browser console for errors
2. Verify Radar publishable key is valid
3. Ensure you're using a publishable key (starts with `prj_live_pk_`)
4. Check that the input group selector matches your HTML

### Autocomplete Not Appearing
1. Verify Radar SDK loaded successfully
2. Check for JavaScript errors in console
3. Ensure no CSS is hiding the `.radar-autocomplete-results` element
4. Check z-index conflicts with other elements

### Address Not Submitting
1. Ensure user selected an address from the dropdown (not just typed)
2. Check that `data-selectedAddress` attribute exists on input
3. Verify the form submission handler is attached correctly

### API Key Errors
- **Invalid API key**: Double-check the key in your script
- **Wrong key type**: Ensure you're using a publishable key (not secret key)
- **Quota exceeded**: Check your usage in Radar dashboard
- **Domain restrictions**: Check domain restrictions in Radar dashboard

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ May require polyfills for Promises

## Security Considerations

1. **API Key Protection**: 
   - Use publishable key (safe for client-side use)
   - Optionally restrict to your domain in Radar dashboard
   - Monitor usage regularly

2. **Input Validation**:
   - Always validate addresses server-side
   - Don't trust client-side data alone

3. **HTTPS Recommended**:
   - HTTPS is recommended for production use

## Testing Checklist

- [ ] Script loads without errors
- [ ] Input field changes from zip to address
- [ ] Autocomplete suggestions appear when typing
- [ ] Selecting an address populates the field
- [ ] Address data is stored correctly
- [ ] Form submission redirects to correct URL
- [ ] Error handling works for invalid inputs
- [ ] Styling matches your site design

## Support

For issues with:
- **This script**: Check console logs for debugging info
- **Radar API**: Visit [Radar Documentation](https://docs.radar.com/)
- **Radar Autocomplete**: See [Radar Autocomplete Documentation](https://docs.radar.com/maps/autocomplete)

## License

This script is provided as-is for use in your project.
