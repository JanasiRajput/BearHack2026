import requests
from datetime import datetime, timedelta, timezone

def format_google_datetime_utc(dt: datetime) -> str:
    """UTC instant as RFC3339 with Z (Google Calendar expects this for UTC dateTime)."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.replace(microsecond=0).isoformat().replace("+00:00", "Z")

def create_google_task(google_token: str, title: str):
    url = "https://tasks.googleapis.com/tasks/v1/lists/@default/tasks"
    headers = {"Authorization": f"Bearer {google_token}"}
    payload = {"title": title}
    response = requests.post(url, headers=headers, json=payload)
    print(f"Google Tasks Response: {response.status_code} - {response.text}")
    if response.status_code not in (200, 201):
        return {"error": response.text, "status": response.status_code}
    try:
        return response.json()
    except Exception:
        return {"error": response.text, "status": response.status_code}

def get_calendar_events(google_token: str):
    url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    headers = {"Authorization": f"Bearer {google_token}"}
    now = datetime.now(timezone.utc)
    params = {
        "timeMin": format_google_datetime_utc(now),
        "timeMax": format_google_datetime_utc(now + timedelta(days=120)),
        "singleEvents": True,
        "orderBy": "startTime",
        "maxResults": 100,
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return {"error": response.text, "items": []}
    return response.json()

def create_calendar_event(google_token: str, summary: str, start_time: str, end_time: str):
    url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    headers = {"Authorization": f"Bearer {google_token}", "Content-Type": "application/json"}
    payload = {
        "summary": summary,
        "start": {"dateTime": start_time, "timeZone": "UTC"},
        "end": {"dateTime": end_time, "timeZone": "UTC"},
    }
    response = requests.post(url, headers=headers, json=payload)
    print(f"Google Calendar Response: {response.status_code} - {response.text}")
    if response.status_code not in (200, 201):
        return {"error": response.text, "status": response.status_code}
    try:
        return response.json()
    except Exception:
        return {"error": response.text, "status": response.status_code}
