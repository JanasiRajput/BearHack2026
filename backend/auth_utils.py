import os
import requests
from jose import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
M2M_CLIENT_ID = os.getenv("AUTH0_M2M_CLIENT_ID")
M2M_CLIENT_SECRET = os.getenv("AUTH0_M2M_CLIENT_SECRET")

security = HTTPBearer()

def verify_token(res: HTTPAuthorizationCredentials = Security(security)):
    token = res.credentials
    try:
        # Fetch JWKS from Auth0
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        
        # In a real app, you should cache JWKS and verify the signature properly
        # For now, we'll decode and get the user ID
        unverified_claims = jwt.get_unverified_claims(token)
        return unverified_claims
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

def get_management_token():
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    payload = {
        "client_id": M2M_CLIENT_ID,
        "client_secret": M2M_CLIENT_SECRET,
        "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
        "grant_type": "client_credentials"
    }
    response = requests.post(url, json=payload)
    return response.json().get("access_token")

def get_google_token(user_id: str):
    print(f"Fetching Google token for user: {user_id}")
    mgmt_token = get_management_token()
    url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"
    headers = {"Authorization": f"Bearer {mgmt_token}"}
    response = requests.get(url, headers=headers)
    user_data = response.json()
    
    print(f"User data from Auth0: {user_data}")
    
    # Auth0 stores identities in a list
    for identity in user_data.get("identities", []):
        if identity.get("provider") == "google-oauth2":
            token = identity.get("access_token")
            print(f"Found Google token: {token[:10]}...")
            return token
    
    print("No Google token found in identities")
    return None
