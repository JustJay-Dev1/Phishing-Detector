from flask import Flask, request, jsonify
from flask_cors import CORS  # Enable Flask-CORS
import joblib
import requests
import re

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Load ML model and vectorizer
model = joblib.load("ML models/phishing_detection_model.pkl")
vectorizer = joblib.load("ML models/tfidf_vectorizer.pkl")

# VirusTotal API key
VT_API_KEY = "Your VirusTotal API Key"  # Replace with your actual API key

# Function to clean email text
def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+|www.\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Route for combined analysis of email and URLs
@app.route("/analyze-email-and-urls", methods=["POST"])
def analyze_email_and_urls():
    data = request.json
    email_body = data.get("email_content", "")
    urls = data.get("urls", [])

    if not email_body or not urls:
        return jsonify({"error": "Email body or URLs are missing."}), 400

    # Email body analysis
    cleaned_body = clean_text(email_body)
    vectorized_body = vectorizer.transform([cleaned_body])
    prediction = model.predict(vectorized_body)[0]
    probability = model.predict_proba(vectorized_body).max()

    email_analysis = {
        "prediction": "phishing" if prediction == 1 else "legitimate",
        "confidence_percentage": round(probability * 100, 2)
    }

    # URL analysis
    headers = {"x-apikey": VT_API_KEY}
    url_results = []
    for url in urls:
        try:
            response = requests.post(
                "https://www.virustotal.com/api/v3/urls",
                headers=headers,
                data={"url": url},
            )
            if response.status_code == 200:
                result = response.json()
                malicious_score = result.get("data", {}).get("attributes", {}).get("last_analysis_stats", {}).get("malicious", 0)
                url_results.append({"url": url, "malicious_score": malicious_score})
            else:
                url_results.append({"url": url, "malicious_score": "Error"})
        except Exception as e:
            url_results.append({"url": url, "malicious_score": "Error", "error": str(e)})

    # Combine scores
    combined_score = (probability * 100 + sum(url["malicious_score"] for url in url_results if isinstance(url["malicious_score"], int))) / (1 + len(url_results))

    return jsonify({
        "email_body_analysis": email_analysis,
        "url_analysis": url_results,
        "combined_score_percentage": round(combined_score, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
