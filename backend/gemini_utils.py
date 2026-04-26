import os
import json
import random
from datetime import datetime
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

FALLBACK_SUGGESTIONS = {
    "high": [
        {"type": "task", "title": "🚀 Deep Work: Project Sprint", "description": "High focus window detected. Use this for your hardest task."},
        {"type": "task", "title": "💪 Power Workout", "description": "Your physical energy is peaking. Great time for a sweat session."},
        {"type": "task", "title": "🗣️ Social Catch-up", "description": "Your verbal fluency is high. Perfect for meetings or friends."},
        {"type": "task", "title": "💡 Creative Brainstorming", "description": "New ideas flow easily now. Grab a notebook!"},
        {"type": "task", "title": "🧹 Organize & Declutter", "description": "Channel this drive into clearing your space."},
        {"type": "task", "title": "🧠 Learn Something Complex", "description": "Your brain is ready for a challenge."},
        {"type": "task", "title": "🌳 Outdoor Adventure", "description": "Get some sun and movement while your energy is up."}
    ],
    "low": [
        {"type": "calendar", "title": "📚 Cozy Reading Hour", "description": "Lower energy detected. Recharging is productive too."},
        {"type": "calendar", "title": "🧘 Guided Meditation", "description": "Perfect time to ground yourself and breathe."},
        {"type": "calendar", "title": "📎 Admin & Filing", "description": "Low energy but high focus for repetitive small tasks."},
        {"type": "calendar", "title": "🧘‍♀️ Gentle Stretching", "description": "Keep the blood moving without overextending."},
        {"type": "calendar", "title": "🛁 Warm Bath / Spa Time", "description": "Prioritize comfort and physical restoration."},
        {"type": "calendar", "title": "✍️ Journaling Session", "description": "Inward reflection is very powerful right now."},
        {"type": "calendar", "title": "🎬 Movie Night", "description": "Give yourself permission to fully disconnect."}
    ]
}

def get_ai_recommendation(energy_level: str):
    try:
        # Time-aware prompt adjustment
        hour = datetime.now().hour
        time_of_day = "morning" if 5 <= hour < 12 else "afternoon" if 12 <= hour < 18 else "evening"
        
        prompt = f"""
        You are a cycle-tracking wellness AI. The user is in a '{energy_level}' energy level phase during the {time_of_day}. 
        Suggest ONE unique activity for their Google Tasks (if high) or Calendar (if low).
        
        Format the response exactly as a JSON object:
        {{
            "type": "task" or "calendar",
            "title": "Short descriptive title with an emoji",
            "description": "Brief reason why this fits their {time_of_day} energy"
        }}
        """
        
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini error: {e}")
        # Return a random diverse fallback to prevent repetition
        return random.choice(FALLBACK_SUGGESTIONS.get(energy_level, FALLBACK_SUGGESTIONS["low"]))
