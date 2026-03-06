# Chrome Web Store API Credentials Setup

Follow these steps once to obtain the OAuth2 credentials needed for automated deployment.

## Step 1: Get the Extension ID

After your first manual publish, your extension has a permanent ID.
Find it at: https://chrome.google.com/webstore/devconsole
It looks like: `abcdefghijklmnopqrstuvwxyz123456`

## Step 2: Create a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create a new project (e.g., "chrome-extension-deploy")
3. Enable the **Chrome Web Store API**:
   - APIs & Services → Library → search "Chrome Web Store API" → Enable

## Step 3: Create OAuth2 Credentials

1. APIs & Services → Credentials → Create Credentials → OAuth client ID
2. Application type: **Web application**
3. Name: "chrome-deploy"
4. Authorized redirect URIs: add `https://developers.google.com/oauthplayground`
5. Save — note the **Client ID** and **Client Secret**

## Step 4: Get a Refresh Token

1. Go to https://developers.google.com/oauthplayground
2. Click the settings gear (top right) → check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In "Step 1", scroll to "Chrome Web Store API v1.1" → select the `...webstore` scope → Authorize
5. In "Step 2", click "Exchange authorization code for tokens"
6. Copy the **Refresh token**

## Step 5: Add GitHub Secrets

In your GitHub repo: Settings → Secrets and variables → Actions → New repository secret

| Secret Name              | Value                     |
|--------------------------|---------------------------|
| `CHROME_EXTENSION_ID`    | Your extension ID         |
| `GOOGLE_CLIENT_ID`       | OAuth Client ID           |
| `GOOGLE_CLIENT_SECRET`   | OAuth Client Secret       |
| `GOOGLE_REFRESH_TOKEN`   | OAuth Refresh Token       |

These secrets are used by the deploy workflow automatically.
