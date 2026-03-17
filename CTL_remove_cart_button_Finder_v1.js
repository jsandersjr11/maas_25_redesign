(function () {
   console.log('[Cart Button Remover] Script initialized');

   // Main function to find and remove cart buttons
   function removeCartButtons() {
     console.log('[Cart Button Remover] Searching for cart buttons to remove');
     
     // Find all cart links using multiple selectors for React-based pages
     const cartSelectors = [
       'a[href="/cart"]',
       'a[href*="/cart"]',
       'a[href*="cart"]',
       '[data-testid*="cart"]',
       '[class*="cart"]',
       '[id*="cart"]'
     ];
     
     let totalRemoved = 0;
     
     cartSelectors.forEach(selector => {
       try {
         const elements = document.querySelectorAll(selector);
         console.log(`[Cart Button Remover] Found ${elements.length} elements with selector: ${selector}`);
         
         elements.forEach((element, index) => {
           // Check if this is actually a cart-related element
           const href = element.getAttribute('href') || '';
           const text = element.textContent?.toLowerCase() || '';
           const className = element.className?.toLowerCase() || '';
           const id = element.id?.toLowerCase() || '';
           const testId = element.getAttribute('data-testid')?.toLowerCase() || '';
           
           const isCartElement = href.includes('cart') || 
                                text.includes('cart') || 
                                className.includes('cart') || 
                                id.includes('cart') || 
                                testId.includes('cart');
           
           if (isCartElement) {
             try {
               // Remove the element
               element.remove();
               totalRemoved++;
               console.log(`[Cart Button Remover] Removed cart element #${index + 1} (${selector})`);
               
             } catch (error) {
               console.error(`[Cart Button Remover] Failed to remove cart element #${index + 1}:`, error);
               
               // Fallback: Hide the element
               try {
                 element.style.cssText = `
                   display: none !important;
                   visibility: hidden !important;
                   opacity: 0 !important;
                   pointer-events: none !important;
                   position: absolute !important;
                   left: -9999px !important;
                   top: -9999px !important;
                   width: 0 !important;
                   height: 0 !important;
                   overflow: hidden !important;
                 `;
                 console.log(`[Cart Button Remover] Hid cart element #${index + 1} (${selector})`);
                 totalRemoved++;
               } catch (hideError) {
                 console.error(`[Cart Button Remover] Failed to hide cart element #${index + 1}:`, hideError);
               }
             }
           }
         });
       } catch (error) {
         console.error(`[Cart Button Remover] Error with selector ${selector}:`, error);
       }
     });
     
     console.log(`[Cart Button Remover] Total cart elements removed/hidden: ${totalRemoved}`);
     return totalRemoved;
   }

   // Run once immediately
   removeCartButtons();
   
   // Also run after page load to catch dynamically loaded elements
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', () => {
       setTimeout(removeCartButtons, 100);
     });
   } else {
     // Page already loaded, run after a short delay
     setTimeout(removeCartButtons, 100);
   }
   
   console.log('[Cart Button Remover] Cart removal completed');
})();