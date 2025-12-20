(function() {
    'use strict';
    
    function updateTextContent() {
        // Target .leshen-banner h5 span and change text to "Headline"
        const headlineSpans = document.querySelectorAll('.leshen-banner h5 span');
        headlineSpans.forEach(function(span) {
            span.textContent = 'It\'s the Holiday Season!';
        });
        
        // Target the first .leshen-banner .leshen-typography-body span and change text to "body"
        const firstBodySpan = document.querySelector('.leshen-banner .leshen-typography-body span');
        if (firstBodySpan) {
            firstBodySpan.textContent = 'Act now - we\'re giving out $250 Visa Reward Cards. Offer valid 12/20/25 - 12/31/25.';
        }
        
        // Target .ReactModalPortal .leshen-typography-body and replace with new HTML
        const modalBodyElements = document.querySelectorAll('.ReactModalPortal .leshen-typography-body');
        modalBodyElements.forEach(function(element) {
            element.outerHTML = '<p class="leshen-typography-body css-2qtueq e1goc7eq0"><span>Visa Reward Card Offer: Not redeemable for cash. For new business Fiber internet customers who maintain service and pricing offer without change for 30 days after service activation.\nMust redeem within 60 days of availability notification. Virtual card delivered electronically 24-\n48 business hours after redemption and expires 6 months after redemption. Visit RewardCenter.Frontier.com for Cardholder Agreement. The Frontier Visa Reward Card is issued by The Bancorp Bank pursuant to a license from Visa U.S.A. Inc. and can be used everywhere Visa debit cards are accepted online. No cash access. The Bancorp Bank; Member FDIC. The Bancorp Bank does not endorse or sponsor and is not affiliated in any way with any product or service offered by Frontier Communications. Gift card offer ends 12/31/2025.</span></p>';
        });
    }
    
    // Run immediately
    updateTextContent();
    
    // Also run after DOM changes (for React apps)
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if any relevant elements were added
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (
                            node.classList.contains('leshen-banner') ||
                            node.classList.contains('ReactModalPortal') ||
                            node.querySelector('.leshen-banner, .ReactModalPortal')
                        )) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });
        
        if (shouldUpdate) {
            updateTextContent();
        }
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also run periodically as a fallback
    setInterval(updateTextContent, 2000);
    
})();
