# Radar Address Autocomplete Implementation

## ✅ Updated to Use Radar Instead of Google Maps

The address qualification script has been updated to use **Radar's Autocomplete API** instead of Google Places. This provides several advantages:

### 🎯 Why Radar?

1. **Cost Effective**: 100,000 free requests/month (vs Google's ~70,000)
2. **No Credit Card**: Free tier requires no payment method
3. **Simple Setup**: Just sign up and get your key
4. **Better Pricing**: $0.50 per 1,000 after free tier (vs Google's $2.83+)
5. **Same Quality**: Accurate US address data with autocomplete
6. **Already Integrated**: Your existing code already uses Radar!

### 📦 Files Created

1. **AddressQualificationScript.js** - Main script using Radar
2. **AddressQualification_README.md** - Complete documentation
3. **AddressQualification_Summary.md** - Quick reference
4. **AddressQualification_QuickTest_Radar.html** - Test page with demo key included

### 🚀 Quick Start (3 Steps)

#### Step 1: Get Your Radar Key (Optional - Demo Key Included)
The script already includes a demo Radar key, but for production:
1. Visit [radar.com/signup](https://radar.com/signup)
2. Sign up (free, no credit card)
3. Copy your publishable key

#### Step 2: Test It
Open `AddressQualification_QuickTest_Radar.html` in your browser:
- Demo key is pre-filled
- Click "Load Script"
- Start typing an address
- See it work immediately!

#### Step 3: Inject on Your Page
```javascript
// Console injection for testing
var script = document.createElement('script');
script.src = 'AddressQualificationScript.js';
document.head.appendChild(script);
```

### 🔄 What Changed from Google Maps

| Feature | Google Maps | Radar |
|---------|-------------|-------|
| **API Key** | Required, complex setup | Included demo key |
| **Free Tier** | ~70,000 requests | 100,000 requests |
| **Setup** | Enable APIs, create key | Sign up, copy key |
| **Cost After Free** | $2.83/1k | $0.50/1k |
| **Credit Card** | Required | Not required |
| **Implementation** | Custom input modification | Built-in widget |

### 💻 How It Works

```
Original HTML:
<div class="input-group">
  <input type="tel" name="zip" placeholder="Zip code">
  <button>Search</button>
</div>

↓ Script Transforms To ↓

<div class="input-group">
  <input type="tel" name="zip" style="display:none">
  <div id="radar-autocomplete-container">
    <!-- Radar widget injected here -->
  </div>
  <button>Check Availability</button>
</div>
```

### 📊 Address Data Captured

When user selects an address, the script stores:
```javascript
{
  formattedAddress: "123 Main St, Springfield, IL 62701, USA",
  street: "123 Main St",
  city: "Springfield",
  state: "IL",
  zip: "62701",
  country: "US",
  lat: 39.7817,
  lng: -89.6501
}
```

### 🎨 Customization

#### Change Country
```javascript
countryCode: 'CA' // Canada only
countryCode: ['US', 'CA'] // US and Canada
```

#### Change Address Types
```javascript
layers: ['address'] // Street addresses only (default)
layers: ['place', 'address'] // Places and addresses
layers: ['postalCode'] // Postal codes
```

#### Modify Redirect
```javascript
const cartUrl = `/cart?address=${encodeURIComponent(formattedAddress)}`;
// Change to your URL format
```

### 🧪 Testing

1. **Quick Test**: Open `AddressQualification_QuickTest_Radar.html`
2. **Console Test**: 
   ```javascript
   var s=document.createElement('script');
   s.src='AddressQualificationScript.js';
   document.head.appendChild(s);
   ```
3. **Verify**: Check browser console for logs

### 🐛 Troubleshooting

**Autocomplete not appearing?**
- Check browser console for errors
- Verify Radar SDK loaded (look for "Radar SDK loaded successfully")
- Ensure input group has class `vwo_bl`

**Wrong address format?**
- Address data is stored in `container.dataset.selectedAddress`
- Check console logs for parsed address

**Need different country?**
- Change `countryCode: 'US'` to your country code

### 📈 Radar vs Google Comparison

| Metric | Radar | Google Maps |
|--------|-------|-------------|
| Free requests/month | 100,000 | ~70,000 |
| Setup time | 2 minutes | 10+ minutes |
| APIs to enable | 0 | 2 |
| Credit card required | No | Yes |
| Cost per 1k (after free) | $0.50 | $2.83 |
| Annual cost (200k/month) | $600 | $3,396 |

### 🔗 Resources

- **Radar Docs**: https://docs.radar.com/maps/autocomplete
- **Radar Signup**: https://radar.com/signup
- **Radar Pricing**: https://radar.com/pricing
- **API Reference**: https://docs.radar.com/api

### ✨ Key Benefits

1. ✅ **Works Immediately** - Demo key included
2. ✅ **No Setup Required** - Just inject the script
3. ✅ **Cost Effective** - Save ~80% vs Google Maps
4. ✅ **Same Quality** - Accurate US address data
5. ✅ **Easy Integration** - Drop-in replacement
6. ✅ **Already Using Radar** - Your existing code uses it!

### 🎯 Next Steps

1. Open `AddressQualification_QuickTest_Radar.html` to see it work
2. Test on your actual page using console injection
3. (Optional) Get your own Radar key for production
4. Deploy via Tag Manager or direct script tag

---

**Note**: The script includes the same Radar key that's already in your `Address Qual to Cart.html` file, so it will work immediately without any additional setup!
