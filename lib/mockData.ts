import { User } from "@/components/UserGrid";

// Mock user data matching the screenshot
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Mila Kunis",
    role: "Admin",
    email: "mila@kunis.com",
    created: "2013/08/08",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "George Clooney",
    role: "Member",
    email: "marlon@brando.com",
    created: "2013/08/12",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Ryan Gosling",
    role: "Registered",
    email: "jack@nicholson",
    created: "2013/03/03",
    status: "Banned",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Emma Watson",
    role: "Registered",
    email: "humphrey@bogart.com",
    created: "2004/01/24",
    status: "Pending",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "5",
    name: "Robert Downey Jr.",
    role: "Admin",
    email: "spencer@tracy",
    created: "2013/12/31",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "6",
    name: "Mila Kunis",
    role: "Admin",
    email: "mila@kunis.com",
    created: "2013/08/08",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: "7",
    name: "George Clooney",
    role: "Member",
    email: "marlon@brando.com",
    created: "2013/08/12",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: "8",
    name: "Ryan Gosling",
    role: "Registered",
    email: "jack@nicholson",
    created: "2013/03/03",
    status: "Banned",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

// Mock fetch function to simulate API call
export async function fetchUsers(): Promise<User[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUsers;
}

