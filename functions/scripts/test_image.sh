curl -X POST http://localhost:5001/${PROJECT_ID}/us-central1/analyzeHistoricalPhoto \
  -H "Content-Type: application/json" \
  -d "{
    \"imageData\": \"$(base64 -i image.jpg | tr -d '\n')\",
    \"mimeType\": \"image/jpeg\"
  }"