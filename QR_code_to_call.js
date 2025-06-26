// add this on to the page first: <div id="widget-anchor"></div>

; (() => {
    // Find the existing anchor div
    const anchor = document.getElementById("widget-anchor")
    if (!anchor) {
      console.error('Anchor div with id "widget-anchor" not found')
      return
    }
  
    // Clear existing content of the anchor
    anchor.innerHTML = ""
  
    // Create and inject styles
    const styles = `
          #widget-anchor {
              margin: 20px;
              display: inline-flex;
          }
  
          .scan-widget {
              background-color: #48D597;
              border-radius: 16px;
              padding: 12px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
          }
  
          .widget-title {
              color: black;
              font-size: 1.5em;
              margin-bottom: 12px;
          }
  
          .qr-container {
              background: white;
              padding: 15px;
              border-radius: 12px;
              margin-bottom: 15px;
              width: 150px;
              height: 150px;
              display: flex;
              justify-content: center;
              align-items: center;
          }
  
          .phone-number {
              color: black;
              font-size: 1.5em;
          }
  
          .loader {
              width: 48px;
              height: 48px;
              border: 5px solid #000;
              border-bottom-color: transparent;
              border-radius: 50%;
              display: inline-block;
              box-sizing: border-box;
              animation: rotation 1s linear infinite;
          }
  
          @keyframes rotation {
              0% {
                  transform: rotate(0deg);
              }
              100% {
                  transform: rotate(360deg);
              }
          }
  
          .skeleton {
              background: #f0f0f0;
              border-radius: 4px;
              height: 20px;
              margin-bottom: 10px;
              animation: pulse 1.5s infinite;
          }
  
          @keyframes pulse {
              0% {
                  opacity: 0.6;
              }
              50% {
                  opacity: 1;
              }
              100% {
                  opacity: 0.6;
              }
          }
  
          .qr-skeleton {
              width: 150px;
              height: 150px;
              background: #f0f0f0;
              border-radius: 12px;
              animation: pulse 1.5s infinite;
          }
      `
  
    // Create style element and inject CSS
    const styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    anchor.appendChild(styleSheet)
  
    // Function to load QR Code script
    function loadQRScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js"
        script.onload = resolve
        script.onerror = reject
        anchor.appendChild(script)
      })
    }
  
    // Function to format phone number
    function formatPhoneNumber(phoneNumber) {
      const cleaned = ("" + phoneNumber).replace(/\D/g, "")
      if (cleaned.length === 10) {
        return `1-${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      } else if (cleaned.length === 11 && cleaned[0] === "1") {
        return `${cleaned[0]}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
      } else {
        console.warn("Unexpected phone number format:", phoneNumber)
        return cleaned // Return the cleaned number without formatting if it doesn't match expected formats
      }
    }
  
    // Function to create widget
    function createWidget() {
      const widget = document.createElement("div")
      widget.className = "scan-widget"
  
      const title = document.createElement("div")
      title.className = "widget-title"
      title.textContent = "Scan to Call"
      widget.appendChild(title)
  
      const qrContainer = document.createElement("div")
      qrContainer.className = "qr-container"
      widget.appendChild(qrContainer)
  
      // Add QR code skeleton
      const qrSkeleton = document.createElement("div")
      qrSkeleton.className = "qr-skeleton"
      qrContainer.appendChild(qrSkeleton)
  
      // Add skeleton for phone number
      const phoneNumberSkeleton = document.createElement("div")
      phoneNumberSkeleton.className = "skeleton"
      phoneNumberSkeleton.style.width = "150px"
      widget.appendChild(phoneNumberSkeleton)
  
      anchor.appendChild(widget)
  
      // Function to generate QR code and display phone number
      function generateQRAndDisplayNumber(formattedPhoneNumber) {
        qrContainer.innerHTML = "" // Clear QR skeleton
        new QRCode(qrContainer, {
          text: formattedPhoneNumber,
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        })
  
        // Replace skeleton with actual phone number
        const phoneNumberElement = document.createElement("div")
        phoneNumberElement.className = "phone-number"
        phoneNumberElement.textContent = formattedPhoneNumber
        widget.replaceChild(phoneNumberElement, phoneNumberSkeleton)
      }
  
      // Function to get phone number from localStorage
      function getPhoneNumber() {
        try {
          const mapiData = JSON.parse(localStorage.getItem("mapi"))
          console.log("Parsed mapi data:", mapiData)
  
          const phoneNumber = mapiData?.knownTokens?.EMB
          console.log("Retrieved phone number:", phoneNumber)
  
          if (phoneNumber) {
            const formattedPhoneNumber = formatPhoneNumber(phoneNumber)
            console.log("Formatted phone number:", formattedPhoneNumber)
            checkPhoneNumberStability(formattedPhoneNumber)
          } else {
            console.warn("No phone number found in localStorage")
            qrContainer.textContent = "No phone number available"
            widget.removeChild(phoneNumberSkeleton)
          }
        } catch (error) {
          console.error("Error getting phone number:", error)
          qrContainer.textContent = "Error loading data"
          widget.removeChild(phoneNumberSkeleton)
        }
      }

      // Function to check if phone number has stabilized
      function checkPhoneNumberStability(initialFormattedNumber) {
        let stableCount = 1; // Already have one check
        let currentNumber = initialFormattedNumber;
        let checkingMessage = document.createElement("div");
        checkingMessage.style.fontSize = "0.8em";
        checkingMessage.style.color = "#333";
        checkingMessage.textContent = "Verifying phone number...";
        widget.appendChild(checkingMessage);
        
        // Display initial QR code
        generateQRAndDisplayNumber(initialFormattedNumber);
        
        // Set up interval to check phone number stability
        const stabilityInterval = setInterval(() => {
          try {
            const mapiData = JSON.parse(localStorage.getItem("mapi"));
            const phoneNumber = mapiData?.knownTokens?.EMB;
            
            if (phoneNumber) {
              const newFormattedNumber = formatPhoneNumber(phoneNumber);
              console.log(`Stability check ${stableCount}: ${newFormattedNumber}`);
              
              if (newFormattedNumber === currentNumber) {
                stableCount++;
                checkingMessage.textContent = `Verifying phone number... ${stableCount}/5`;
                
                if (stableCount >= 5) {
                  // Phone number has stabilized
                  clearInterval(stabilityInterval);
                  checkingMessage.textContent = "Phone number verified!";
                  setTimeout(() => {
                    widget.removeChild(checkingMessage);
                  }, 2000);
                  console.log("Phone number has stabilized:", newFormattedNumber);
                }
              } else {
                // Phone number changed, reset counter and update QR code
                console.log("Phone number changed from", currentNumber, "to", newFormattedNumber);
                currentNumber = newFormattedNumber;
                stableCount = 1;
                checkingMessage.textContent = "Phone number changed, reverifying... 1/5";
                generateQRAndDisplayNumber(newFormattedNumber);
              }
            }
          } catch (error) {
            console.error("Error during stability check:", error);
            clearInterval(stabilityInterval);
            checkingMessage.textContent = "Error verifying phone number";
          }
        }, 1000); // Check every second
      }

      // Delay getting the phone number to simulate loading
      setTimeout(getPhoneNumber, 1500) // 1.5 second delay
    }
  
    // Initialize widget
    loadQRScript()
      .then(() => {
        createWidget()
      })
      .catch((error) => console.error("Error loading QR code script:", error))
  })()
  
  