"use client";

import { UserGrid } from "@/components/UserGrid";
import { mockUsers } from "@/lib/mockData";

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">Manage and view all users in the system</p>
      </div>
      <UserGrid users={mockUsers} />
    </div>
  );
}

