async function analyzeEmailAndUrls(emailBody, urls) {
  try {
    const response = await fetch("http://127.0.0.1:5000/analyze-email-and-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_content: emailBody, urls }),
    });
    return response.json();
  } catch (error) {
    console.error("Error in combined analysis:", error);
    throw new Error("Failed to analyze email and URLs.");
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processEmailData") {
    const { emailBody, urls } = message;

    if (!emailBody || !urls) {
      sendResponse({ error: "Invalid email data or URLs." });
      return;
    }

    analyzeEmailAndUrls(emailBody, urls)
      .then((combinedResult) => {
        sendResponse({
          status: "Data sent successfully",
          combinedResult,
        });
      })
      .catch((error) => {
        console.error("Error processing email and URLs:", error);
        sendResponse({ error: "Failed to process email and URLs." });
      });

    return true; // Keep the response channel open for async calls
  }
});
