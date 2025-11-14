/**
 * OAuth 2.0 PKCE (Proof Key for Code Exchange) utilities
 * Enables OAuth authentication for static sites without server-side API routes
 */

/**
 * Generates a cryptographically random string for PKCE code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Generates code challenge from code verifier using SHA256
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(digest));
}

/**
 * Base64 URL encoding (RFC 4648)
 */
function base64URLEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Stores code verifier in sessionStorage for later use
 */
export function storeCodeVerifier(verifier: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("oauth_code_verifier", verifier);
  }
}

/**
 * Retrieves and removes code verifier from sessionStorage
 */
export function getCodeVerifier(): string | null {
  if (typeof window !== "undefined") {
    const verifier = sessionStorage.getItem("oauth_code_verifier");
    sessionStorage.removeItem("oauth_code_verifier");
    return verifier;
  }
  return null;
}

/**
 * Initiates OAuth 2.0 PKCE flow with Google
 */
export async function initiateGoogleOAuth(): Promise<void> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store verifier for later use
  storeCodeVerifier(codeVerifier);

  // Build authorization URL
  const redirectUri = `${window.location.origin}/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  // Redirect to Google OAuth
  window.location.href = authUrl;
}

/**
 * Exchanges authorization code for tokens using PKCE
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_in: number;
}> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  }

  const redirectUri = `${window.location.origin}/auth/callback`;
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
}

/**
 * Decodes JWT token to get user information
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Failed to decode JWT");
  }
}

/**
 * Stores tokens in localStorage
 */
export function storeTokens(tokens: {
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_in: number;
}): void {
  if (typeof window !== "undefined") {
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem("oauth_tokens", JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      id_token: tokens.id_token,
      expires_at: expiresAt,
    }));
  }
}

/**
 * Retrieves tokens from localStorage
 */
export function getStoredTokens(): {
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_at: number;
} | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("oauth_tokens");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return null;
}

/**
 * Clears stored tokens
 */
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("oauth_tokens");
  }
}

/**
 * Checks if tokens are expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

/**
 * Refreshes access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{
  access_token: string;
  id_token: string;
  expires_in: number;
}> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return await response.json();
}

