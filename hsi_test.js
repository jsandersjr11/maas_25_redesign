$0.textContent = "Visit Highspeedinternet.com";
$0.href = "https://www.highspeedinternet.com";
const data = {
  newTextContent: $0.textContent,
  newHref: $0.href
};




// Combined function to update both text content and href
const spanElement = document.querySelector('.button-text.css-25jbay.e1hk20aw0');
const anchorElement = document.querySelector('a.leshen-link.leshen-link-button-wrapper.css-1s55t5c.e9y95tf0');

// Update both elements
spanElement.textContent = 'Visit Highspeedinternet.com';
anchorElement.href = 'https://highspeedinternet.com';

// Single data object with both changes
const data = {
  newTextContent: spanElement.textContent,
  newHref: anchorElement.href
};