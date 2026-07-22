(function () {
  console.log('[GFT Get Quote] Script initialized');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMainScript);
  } else {
    initializeMainScript();
  }

  function initializeMainScript() {
    console.log('[GFT Get Quote] Initializing main script');

    // go.frontier.com/availability/ca
    // Change the zip check cta to a "get free quote" cta in the sticky cta bar everywhere with link to megaform.
    // Change the zip check hero cta to "get a free quote" cta with link to megaform

const newHtml = `<a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 get-free-quote get-free-quote-hero-sticky" href="/free-quote" visibility="All devices"><button class="leshen-phone-cta convert-phone-button css-1svb2z ex50p320" color="primary" tabindex="0" type="button" data-cta-type="call" data-gtm-vis-first-on-screen7314210_138="799" data-gtm-vis-total-visible-time7314210_138="100" data-gtm-vis-has-fired7314210_138="1"><span class="button-text css-wla7xr e1hk20aw0">Get Free Quote </span></button></a>`;

let replacedCount = 0;

// 1. We look for any element that matches our previous replacement structure to update it.
// Previous structure had text "Get Free Quote" (no trailing space) or "Free Quote".
const linksToUpdate = Array.from(document.querySelectorAll('a[href="/free-quote"]'));

linksToUpdate.forEach(link => {
    const container = document.createElement('div');
    container.innerHTML = newHtml;
    const newLink = container.firstChild;
    link.replaceWith(newLink);
    replacedCount++;
});

// 2. We also check if there are any original .leshen-form elements with the zip_postal input still remaining
const forms = document.querySelectorAll('.leshen-form');
forms.forEach(form => {
  const input = form.querySelector('input[name="zip_postal"]');
  if (input) {
    const container = document.createElement('div');
    container.innerHTML = newHtml;
    const newLink = container.firstChild;
    form.replaceWith(newLink);
    replacedCount++;
  }
});

const data = {
  replacedCount: replacedCount
};

// Add secondary "get free quote" cta to all package cards with link to megaform


(function() {
    const leshenStack = document.querySelector('.leshen-stack');
    
    if (!leshenStack) {
        console.warn('Could not find .leshen-stack');
        return;
    }

    const slides = leshenStack.querySelectorAll('.embla__slide');

    slides.forEach((slide) => {
        const callCta = slide.querySelector('[data-cta-type="call"]');

        if (callCta) {
            const parentDiv = callCta.closest('div');

            if (parentDiv) {
                const newLinkHtml = `
                    <a class="leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 get-free-quote get-free-quote-card" 
                       href="/free-quote" 
                       visibility="All devices" 
                       style="width: 100%; display: block; text-decoration: none;">
                        <button class="leshen-phone-cta convert-phone-button css-1svb2z ex50p320" 
                                color="primary" 
                                tabindex="0" 
                                type="button" 
                                data-cta-type="call" 
                                style="
                                    width: 100%;
                                    background-color: #fff;
                                    box-shadow: none;
                                    border: 2px solid black;
                                    cursor: pointer;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                ">
                            <span class="button-text css-wla7xr e1hk20aw0" style="color: #000;">
                                Get Free Quote 
                            </span>
                        </button>
                    </a>`;

                parentDiv.insertAdjacentHTML('afterend', newLinkHtml);
            }
        }
    });
    })();

    (function() {
    const packageCards = document.querySelectorAll('.ermf1vl1 .leshen-package-card');
    
    if (packageCards.length === 0) {
        console.warn('Could not find .leshen-package-card elements');
        return;
    }

    packageCards.forEach((card) => {
        const callCta = card.querySelector('[data-cta-type=call]');

        if (callCta) {
            const parentDiv = callCta.closest('div');

            if (parentDiv) {
                const newLinkHtml = `
                    <a class='leshen-link leshen-link-button-wrapper css-1s55t5c e9y95tf0 get-free-quote get-free-quote-card' 
                       href='/free-quote' 
                       visibility='All devices' 
                       style='width: 100%; display: block; text-decoration: none;'>
                        <button class='leshen-phone-cta convert-phone-button css-1svb2z ex50p320' 
                                color='primary' 
                                tabindex='0' 
                                type='button' 
                                data-cta-type='call' 
                                style='
                                    width: 100%;
                                    background-color: #fff;
                                    box-shadow: none;
                                    border: 2px solid black;
                                    cursor: pointer;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                '>
                            <span class='button-text css-wla7xr e1hk20aw0' style='color: #000;'>
                                Get Free Quote 
                            </span>
                        </button>
                    </a>`;

                parentDiv.insertAdjacentHTML('afterend', newLinkHtml);
            }
        }
    });
    })();

  console.log('[GFT Get Quote] Main script execution completed');
  }
})();