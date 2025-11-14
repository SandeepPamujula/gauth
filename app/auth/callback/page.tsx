"use client";

/**
 * OAuth callback page - handles the redirect from Google OAuth
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  exchangeCodeForTokens,
  getCodeVerifier,
  storeTokens,
  decodeJWT,
} from "@/lib/pkce";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Use window.location.search for static export compatibility
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      const code = params.get("code");
      const errorParam = params.get("error");

      // Handle OAuth error
      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // Missing authorization code
      if (!code) {
        setError("Missing authorization code");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      try {
        // Get stored code verifier
        const codeVerifier = getCodeVerifier();
        if (!codeVerifier) {
          throw new Error("Code verifier not found. Please try signing in again.");
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code, codeVerifier);

        // Store tokens
        storeTokens(tokens);

        // Decode user info from ID token
        const decoded = decodeJWT(tokens.id_token);

        // Notify other tabs/windows about the auth change
        if (typeof window !== "undefined") {
          window.localStorage.setItem("oauth_tokens", JSON.stringify({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            id_token: tokens.id_token,
            expires_at: Date.now() + tokens.expires_in * 1000,
          }));
          // Trigger storage event for same-tab listeners
          window.dispatchEvent(new Event("storage"));
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(
          err instanceof Error ? err.message : "Authentication failed. Please try again."
        );
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Completing sign in...</h1>
        <p className="text-gray-600">Please wait while we finish authenticating you.</p>
      </div>
    </div>
  );
}

