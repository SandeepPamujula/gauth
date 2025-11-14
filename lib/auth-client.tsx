"use client";

/**
 * Client-side authentication context using OAuth 2.0 PKCE
 * Works with static exports (no server-side API routes needed)
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getStoredTokens,
  clearTokens,
  isTokenExpired,
  decodeJWT,
  refreshAccessToken,
  storeTokens,
} from "./pkce";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const tokens = getStoredTokens();
      
      if (!tokens) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(tokens.expires_at)) {
        // Try to refresh if we have a refresh token
        if (tokens.refresh_token) {
          try {
            const newTokens = await refreshAccessToken(tokens.refresh_token);
            const expiresAt = Date.now() + newTokens.expires_in * 1000;
            storeTokens({
              ...newTokens,
              refresh_token: tokens.refresh_token, // Keep the refresh token
              expires_in: newTokens.expires_in,
            });
            
            // Decode new ID token
            const decoded = decodeJWT(newTokens.id_token);
            setUser({
              id: decoded.sub,
              name: decoded.name,
              email: decoded.email,
              picture: decoded.picture,
            });
          } catch (error) {
            // Refresh failed, clear tokens
            console.error("Token refresh failed:", error);
            clearTokens();
            setUser(null);
          }
        } else {
          // No refresh token, clear tokens
          clearTokens();
          setUser(null);
        }
      } else {
        // Token is still valid, decode and set user
        const decoded = decodeJWT(tokens.id_token);
        setUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const signOut = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  // Listen for storage changes (e.g., from callback page)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "oauth_tokens") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

