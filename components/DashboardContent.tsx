"use client";

import { useEffect, useState } from "react";
import { UserGrid, User } from "@/components/UserGrid";
import { fetchUsers } from "@/lib/mockData";

export function DashboardContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">Manage and view all users in the system</p>
      </div>
      <UserGrid users={users} />
    </div>
  );
}

