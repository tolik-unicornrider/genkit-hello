curl -X POST http://localhost:5001/${PROJECT_ID}/us-central1/analyzeMeme \
  -H "Content-Type: application/json" \
  -d "{
    \"imageData\": \"$(base64 -i meme.jpg | tr -d '\n')\",
    \"mimeType\": \"image/jpeg\",
    \"text\": \"Optional text that appears in the meme\"
  }"