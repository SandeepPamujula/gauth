"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { initiateGoogleOAuth } from "@/lib/pkce";

export function AuthButton() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await initiateGoogleOAuth();
    } catch (error) {
      console.error("Failed to initiate OAuth:", error);
      alert("Failed to start authentication. Please check your configuration.");
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600">Signed in as {user.email}</p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={signOut}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Sign in with Google
    </button>
  );
}

