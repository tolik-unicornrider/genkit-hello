curl -X POST https://us-central1-coffee-ai-399420.cloudfunctions.net/analyzeMeme \
  -H "Content-Type: application/json" \
  -d "{
    \"imageData\": \"$(base64 -i meme.jpg | tr -d '\n')\",
    \"mimeType\": \"image/jpeg\",
    \"text\": \"Optional text that appears in the meme\"
  }"