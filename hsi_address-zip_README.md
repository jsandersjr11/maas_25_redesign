# HSI Address/ZIP Form Injector

Clean implementation of ZIP code form injection without VWO dependencies.

## Files

- **hsi_address-zip.html** - Demo HTML page with styling
- **hsi_address-zip.js** - Injectable JavaScript functions

## Usage

### Method 1: Direct Script Injection

```javascript
// Load the script
const script = document.createElement('script');
script.src = 'path/to/hsi_address-zip.js';
document.head.appendChild(script);

// After script loads, call the functions
script.onload = function() {
  injectZipForm();      // Injects the form
  initFormTracking();   // Starts tracking form interactions
};
```

### Method 2: Inline/Console Injection

Copy the entire contents of `hsi_address-zip.js` and paste into browser console, then run:

```javascript
injectZipForm();
initFormTracking();
```

### Method 3: Auto-Initialize

Uncomment the `init()` line at the bottom of `hsi_address-zip.js` (line ~160) to auto-run on page load.

## Functions

### `injectZipForm()`
Injects the ZIP code search form after the `.geo-hero` element and hides the original `.geo-hero__zip` if present.

### `initFormTracking()`
Sets up event tracking for form interactions. Fires a custom event `form_start_zip_or_address` on first user input.

### `sendCustomEvent(eventName)`
Dispatches custom events for tracking. Integrates with Google Analytics dataLayer if available.

### `init()`
Convenience function that runs both `injectZipForm()` and `initFormTracking()` when DOM is ready.

## Custom Events

The script fires the following custom event:
- **form_start_zip_or_address** - Triggered on first input in ZIP or address forms

Listen for events:
```javascript
document.addEventListener('form_start_zip_or_address', function(e) {
  console.log('User started filling form', e.detail);
});
```

## Analytics Integration

The script automatically pushes events to `window.dataLayer` if Google Tag Manager is present:

```javascript
{
  event: 'form_start_zip_or_address',
  timestamp: '2025-10-20T21:27:00.000Z'
}
```

## Requirements

- Target element `.geo-hero` must exist on the page
- No external dependencies (vanilla JavaScript)
- Works with modern browsers (ES6+)

## Customization

Edit the `formHTML` variable in `injectZipForm()` to modify the form structure or styling.
