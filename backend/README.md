# 🐍 RedTales Backend

The Python backend for **RedTales AI**, powered by FastAPI and Google Gemini.

## 🚀 Development

### Setup
1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_key
   AUTH0_DOMAIN=your_auth0_domain
   AUTH0_AUDIENCE=your_auth0_audience
   FRONTEND_URL=http://localhost:5173
   ```

### Running
Start the server with Uvicorn:
```bash
uvicorn main:app --reload
```

## 🛠️ API Endpoints

- `GET /`: Health check.
- `POST /sync`: Generates an AI recommendation based on energy level and syncs to Google Tasks/Calendar.
- `GET /events`: Fetches upcoming calendar events from the connected Google account.

## 🤖 AI Logic
The backend uses **Gemini 1.5 Flash** to generate context-aware suggestions. It falls back to a curated list of suggestions if the API is unavailable or returns an error.

## 🔐 Security
Uses `python-jose` for JWT verification and `auth_utils.py` to handle Auth0 tokens. Google tokens are managed via a simplified storage mock in `auth_utils.py`.
