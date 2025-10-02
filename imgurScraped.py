import requests

TOKEN_INFO = {
    "refresh_token": "3c1e9fd2fa0fe588f898d7793a7aeef4e778715b",
    "client_id": "14ab8d8f23df9ca",
    "client_secret": "b4e200d1484aa06b65c0e1201a2ea6576a23f211",
    "access_token_url": "https://api.imgur.com/oauth2/token"
}

def refresh_access_token():
    data = {
        "refresh_token": TOKEN_INFO["refresh_token"],
        "client_id": TOKEN_INFO["client_id"],
        "client_secret": TOKEN_INFO["client_secret"],
        "grant_type": "refresh_token"
    }
    response = requests.post(TOKEN_INFO["access_token_url"], data=data)
    if response.status_code == 200:
        new_tokens = response.json()
        print("New Access Token:", new_tokens["access_token"])
        print("New Refresh Token:", new_tokens["refresh_token"])
    else:
        print("Failed to refresh token:", response.text)

#scraped hehehe
refresh_access_token()
