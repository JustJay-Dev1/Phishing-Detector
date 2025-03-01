# Phishing Detector Chrome Extension

This Chrome extension helps detect phishing attempts in emails using a combination of VirusTotal API and machine learning. It integrates with Gmail to analyze email content and embedded links, providing an overall risk score.

## Features
- Analyzes email content for phishing indicators using a trained ML model.
- Scans links in the email using the VirusTotal API.
- Displays combined risk score and detailed analysis.

## Installation
1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer Mode** in the top-right corner.
4. Click on **Load unpacked** and select the folder containing the extension files.
5. The extension should now be added to your browser.

## Usage
1. Open Gmail and view an email.
2. Activate the extension by clicking on its icon.
3. Toggle the scan button to analyze the email content and links.
4. View the results in the extension popup.

## Backend Setup
The extension relies on a Flask server for the machine learning analysis. Follow these steps to set it up:
1. Install Python and pip.
2. Navigate to the project directory containing `app.py`.
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
