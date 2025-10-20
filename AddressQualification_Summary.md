# Address Qualification Script - Summary

## 📦 What Was Created

Three files have been created for the address qualification functionality:

1. **AddressQualificationScript.js** - The main injectable script
2. **AddressQualification_README.md** - Comprehensive documentation
3. **AddressQualification_Example.html** - Demo page for testing

## 🎯 What It Does

The script automatically transforms your existing zip code input into an address input with Radar Autocomplete:

### Before (Original HTML):
```html
<div class="input-group">
  <input type="tel" name="zip" data-type="zip" placeholder="Zip code" maxlength="5">
  <button type="submit">Search</button>
</div>
```

### After (Script Transforms To):
```html
<div class="input-group">
  <input type="tel" name="zip" style="display: none;"> <!-- Hidden -->
  <div id="radar-autocomplete-container"> <!-- Radar widget injected here -->
  <button type="submit">Check Availability</button>
</div>
```

Plus adds Radar Autocomplete widget with full functionality!

## ✨ Key Features

- ✅ **Automatic Container Detection** - Finds and prepares the input group automatically
- ✅ **Radar Integration** - Real-time address suggestions with built-in UI
- ✅ **US Address Restriction** - Only shows US addresses (configurable)
- ✅ **Complete Address Data** - Extracts street, city, state, zip, coordinates
- ✅ **Error Handling** - Shows errors if invalid address or no selection
- ✅ **URL Redirect** - Formats address and redirects to `/cart?address=...`
- ✅ **Non-Destructive** - Doesn't break existing functionality
- ✅ **Cost Effective** - Free tier includes 100,000 requests/month

## 🚀 Quick Start

### Step 1: Get Radar Publishable Key
1. Go to [Radar](https://radar.com/signup) and sign up (free)
2. Navigate to your dashboard
3. Copy your Publishable Key (starts with `prj_live_pk_`)
4. Free tier: 100,000 requests/month
5. No credit card required

### Step 2: Configure Script
Open `AddressQualificationScript.js` and add your Radar key:
```javascript
const RADAR_PUBLISHABLE_KEY = 'prj_live_pk_YOUR_KEY_HERE';
```

**Note**: A demo key is already included, but replace it with your own for production.

### Step 3: Inject Script
Choose one method:

**Browser Console (Testing):**
```javascript
var script = document.createElement('script');
script.src = 'AddressQualificationScript.js';
document.head.appendChild(script);
```

**HTML Tag (Development):**
```html
<script src="AddressQualificationScript.js"></script>
```

**Tag Manager (Production):**
- Copy entire script content
- Create Custom HTML tag
- Wrap in `<script>` tags
- Set appropriate trigger

## 📊 How It Works

```
1. Script loads → Detects input group
                 ↓
2. Prepares container → Hides zip input, creates Radar container
                 ↓
3. Loads Radar SDK → Initializes Radar Autocomplete widget
                 ↓
4. User types address → Shows suggestions
                 ↓
5. User selects → Stores address data
                 ↓
6. User submits → Redirects to /cart?address=...
```

## 💾 Address Data Stored

When user selects an address, the script stores:

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

Stored in: `inputElement.dataset.selectedAddress`

## 🎨 Customization Examples

### Change Country Restriction
```javascript
countryCode: 'CA' // Canada
countryCode: ['US', 'CA'] // US and Canada
```

### Change Address Layers
```javascript
layers: ['address']              // Only street addresses
layers: ['place', 'address']     // Places and addresses
layers: ['postalCode']           // Postal codes
// Available: place, address, intersection, street, neighborhood, postalCode, locality, county, state, country
```

### Modify Redirect URL
```javascript
// Current:
const cartUrl = `/cart?address=${encodeURIComponent(formattedAddress)}`;

// Custom:
const cartUrl = `/checkout?location=${encodeURIComponent(formattedAddress)}`;
```

### Custom Button Text
```javascript
if (submitButton) {
  submitButton.textContent = 'Find Services'; // Change from 'Check Availability'
}
```

## 🧪 Testing Checklist

- [ ] Script loads without console errors
- [ ] Input field changes from "Zip code" to "Enter your address"
- [ ] Typing shows autocomplete suggestions
- [ ] Selecting address populates the field
- [ ] Green border appears on valid selection
- [ ] Submit button redirects to correct URL with address parameter
- [ ] Error message shows if no address selected
- [ ] Works on mobile devices
- [ ] Autocomplete dropdown is properly styled

## 🐛 Common Issues & Solutions

### Issue: Autocomplete not appearing
**Solutions:**
- Check Radar key is valid
- Verify you're using a publishable key (starts with `prj_live_pk_`)
- Check browser console for errors
- Ensure no CSS is hiding `.radar-autocomplete-results`

### Issue: "Invalid API key" error
**Solutions:**
- Double-check the Radar key in script
- Ensure you're using publishable key (not secret key)
- Verify key is active in Radar dashboard

### Issue: Script not finding input field
**Solutions:**
- Verify the input has `name="zip"` and `data-type="zip"`
- Check if input is loaded dynamically (may need delay)
- Inspect HTML structure matches expected format

### Issue: Form not submitting
**Solutions:**
- Ensure user selected address from dropdown (not just typed)
- Check that `data-selectedAddress` attribute exists
- Verify no other scripts are interfering

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| IE11    | ⚠️ Needs polyfills |

## 🔒 Security Notes

1. **Publishable Key**: Safe to use client-side (no secret key needed)
2. **Domain Restrictions**: Optionally restrict to your domain in Radar dashboard
3. **Use HTTPS**: Recommended for production use
4. **Server Validation**: Always validate addresses server-side
5. **Monitor Usage**: Check Radar dashboard regularly

## 📈 API Costs

Radar pricing:
- **Free Tier**: 100,000 requests/month (no credit card required)
- **Growth Plan**: $0.50 per 1,000 requests after free tier
- **Enterprise**: Custom pricing for high volume

This script uses:
- 1 Autocomplete request per user search
- Significantly more cost-effective than Google Maps

## 🔗 Useful Links

- [Radar Platform](https://radar.com/)
- [Radar Autocomplete Docs](https://docs.radar.com/maps/autocomplete)
- [Radar API Documentation](https://docs.radar.com/api)
- [Radar Pricing](https://radar.com/pricing)

## 📞 Support

For questions or issues:
1. Check the comprehensive README.md
2. Review browser console logs (script logs all actions)
3. Test with the Example.html demo page
4. Verify Radar SDK configuration

## 🎓 Next Steps

1. ✅ Get Radar publishable key
2. ✅ Add key to script
3. ✅ Test with QuickTest.html
4. ✅ Inject on your actual page
5. ✅ Monitor and adjust as needed

---

**Created for**: Address qualification on pages with zip code inputs  
**Compatible with**: Existing HTML structure (non-destructive injection)  
**Dependencies**: Radar SDK (automatically loaded)  
**License**: Use freely in your project
