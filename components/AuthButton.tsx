"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600">Signed in as {session.user?.email}</p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => signOut()}
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
      onClick={() => signIn("google")}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Sign in with Google
    </button>
  );
}

