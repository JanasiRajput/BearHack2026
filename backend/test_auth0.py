import os
import requests
from dotenv import load_dotenv

# Load environment variables from the backend folder
load_dotenv("/Users/janasirajput/BearHacks26-final/backend/.env")

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
M2M_CLIENT_ID = os.getenv("AUTH0_M2M_CLIENT_ID")
M2M_CLIENT_SECRET = os.getenv("AUTH0_M2M_CLIENT_SECRET")

def test_management_api():
    print(f"Testing Auth0 Domain: {AUTH0_DOMAIN}")
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    payload = {
        "client_id": M2M_CLIENT_ID,
        "client_secret": M2M_CLIENT_SECRET,
        "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
        "grant_type": "client_credentials"
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        token = response.json().get("access_token")
        if token:
            print("✅ Successfully retrieved Management API Token")
            # Try to list users (limit 1) to verify permissions
            users_url = f"https://{AUTH0_DOMAIN}/api/v2/users"
            headers = {"Authorization": f"Bearer {token}"}
            params = {"per_page": 1}
            users_response = requests.get(users_url, headers=headers, params=params)
            users_response.raise_for_status()
            print("✅ Successfully listed users from Management API")
            return True
        else:
            print("❌ Failed to retrieve Management API Token")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return False

if __name__ == "__main__":
    test_management_api()
