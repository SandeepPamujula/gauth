import { AuthButton } from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to MyApp 🚀</h1>
      <p className="text-gray-500 mb-8">
        Simple, secure authentication with Google.
      </p>
      <AuthButton />
    </main>
  );
}

