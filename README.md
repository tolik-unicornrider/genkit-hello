# Historical Image Analysis Service

A service that analyzes historical images using Google's Gemini AI.

## Local Development Setup

### Prerequisites

1. Install Node.js (v18 or later)
2. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Initial Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Get your Google AI API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and paste it in your `.env` file:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

### Running the Service

1. Start the Firebase emulator:
```bash
firebase emulators:start
```
This will start the emulator at http://localhost:5001 and the emulator UI at http://localhost:4000

2. Test with an image:
```bash
# Make the test script executable
chmod +x scripts/test_image.sh

# Run the test (replace image.jpg with your image file)
./scripts/test_image.sh
```

## API Endpoints

- `POST /analyzeHistoricalPhoto`
  - Analyzes historical photos and provides detailed context
  - Accepts: 
    - `imageData`: Base64 encoded image
    - `mimeType`: Image MIME type (e.g., "image/jpeg")
```

Also, let's create the `.env.example` file:

```plaintext:.env.example
# Get your API key from https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_api_key_here
```
