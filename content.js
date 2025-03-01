chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractEmailData") {
      // Select the email body container (adjust selector based on the email client)
      const emailBodyElement = document.querySelector(".a3s.aiL"); // Gmail's email body class
      if (!emailBodyElement) {
        sendResponse({ error: "Email body not found." });
        return;
      }
  
      // Extract email body text
      const emailBody = emailBodyElement.innerText || "";
  
      // Extract links from <a> tags within the email body
      const anchorTags = emailBodyElement.querySelectorAll("a[href]");
      const extractedUrls = Array.from(anchorTags).map((anchor) => anchor.href);
  
      // Send the extracted email body and links
      sendResponse({ body: emailBody, urls: extractedUrls });
    }
  });
  