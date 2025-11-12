import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome, {session.user?.name}!</h1>
    </div>
  );
}

