from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth_utils import verify_token, get_google_token
from google_utils import create_google_task, create_calendar_event, get_calendar_events, format_google_datetime_utc
from datetime import datetime, timedelta, timezone
import os

app = FastAPI(title="RedTales AI Backend")

# Debugging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5174")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SyncRequest(BaseModel):
    energy_level: str  # "high" or "low"

@app.get("/")
async def root():
    return {"message": "RedTales AI Backend is running"}

from gemini_utils import get_ai_recommendation

@app.post("/sync")
async def sync_lifestyle(request: SyncRequest, user=Depends(verify_token)):
    print(f"User claims from token: {user}")
    user_id = user.get("sub")
    google_token = get_google_token(user_id)
    
    if not google_token:
        raise HTTPException(status_code=400, detail="Google account not connected or token not found")
    
    # Get AI recommendation from Gemini
    recommendation = get_ai_recommendation(request.energy_level)
    print(f"AI Recommendation: {recommendation}")
    
    results = []
    
    if recommendation["type"] == "task":
        task_title = f"AI Suggestion: {recommendation['title']}"
        task_result = create_google_task(google_token, task_title)
        if isinstance(task_result, dict) and task_result.get("error"):
            raise HTTPException(status_code=502, detail=f"Google Tasks: {task_result['error']}")

        now = datetime.now(timezone.utc)
        start_time = format_google_datetime_utc(now + timedelta(hours=2))
        end_time = format_google_datetime_utc(now + timedelta(hours=3))
        cal = create_calendar_event(google_token, f"🚀 {recommendation['title']}", start_time, end_time)
        if isinstance(cal, dict) and cal.get("error"):
            raise HTTPException(status_code=502, detail=f"Google Calendar: {cal['error']}")

        results.append({"type": "task", "status": "created", "title": task_title, "reason": recommendation["description"]})

    elif recommendation["type"] == "calendar":
        now = datetime.now(timezone.utc)
        start_time = format_google_datetime_utc(now + timedelta(hours=1))
        end_time = format_google_datetime_utc(now + timedelta(hours=1, minutes=30))

        event_summary = f"AI Suggestion: {recommendation['title']}"
        event_result = create_calendar_event(google_token, event_summary, start_time, end_time)
        if isinstance(event_result, dict) and event_result.get("error"):
            raise HTTPException(status_code=502, detail=f"Google Calendar: {event_result['error']}")
        results.append({"type": "calendar", "status": "scheduled", "summary": event_summary, "reason": recommendation["description"]})
    
    return {"status": "success", "actions_taken": results}

@app.get("/events")
async def list_events(user=Depends(verify_token)):
    user_id = user.get("sub")
    google_token = get_google_token(user_id)
    if not google_token:
        raise HTTPException(status_code=400, detail="Google account not connected")
    
    events = get_calendar_events(google_token)
    if isinstance(events, dict) and events.get("error"):
        raise HTTPException(status_code=502, detail=str(events.get("error")))
    return events

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
