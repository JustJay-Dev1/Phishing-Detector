document.getElementById("extractToggle").addEventListener("click", () => {
    const statusText = document.getElementById("statusText");
    const emailResults = document.getElementById("emailResults");
    const combinedResult = document.getElementById("combinedResult");
    const maliciousLinks = document.getElementById("maliciousLinks");

    const isScanning = statusText.innerText === "Scanning is OFF";
    statusText.innerText = isScanning ? "Scanning is ON" : "Scanning is OFF";
    statusText.style.color = isScanning ? "green" : "#b0d4f1";

    if (isScanning) {
        emailResults.innerText = "Processing...";
        combinedResult.innerText = "Processing...";
        maliciousLinks.innerHTML = "";

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "extractEmailData" }, (response) => {
                if (!response || response.error) {
                    emailResults.innerText = "Error: Unable to extract email data.";
                    combinedResult.innerText = "0%";
                    return;
                }

                const { body, urls } = response;

                chrome.runtime.sendMessage({ action: "processEmailData", emailBody: body, urls }, (result) => {
                    if (!result || result.error) {
                        emailResults.innerText = "Error: Analysis failed.";
                        combinedResult.innerText = "0%";
                        return;
                    }

                    emailResults.innerText = `${result.combinedResult.email_body_analysis.prediction} (Confidence: ${result.combinedResult.email_body_analysis.confidence_percentage}%)`;
                    combinedResult.innerText = `${result.combinedResult.combined_score_percentage}%`;

                    result.combinedResult.url_analysis.forEach((url) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `${url.url} <span style="color: red;">(Score: ${url.malicious_score})</span>`;
                        maliciousLinks.appendChild(listItem);
                    });
                });
            });
        });
    }
});