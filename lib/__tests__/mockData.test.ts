import { mockUsers, fetchUsers } from "../mockData";
import { User } from "@/components/UserGrid";

describe("mockData", () => {
  describe("mockUsers", () => {
    it("contains user data", () => {
      expect(mockUsers).toBeDefined();
      expect(Array.isArray(mockUsers)).toBe(true);
      expect(mockUsers.length).toBeGreaterThan(0);
    });

    it("each user has required properties", () => {
      mockUsers.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("role");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("created");
        expect(user).toHaveProperty("status");
        expect(user).toHaveProperty("avatar");
      });
    });

    it("user statuses are valid", () => {
      const validStatuses: User["status"][] = ["Active", "Inactive", "Banned", "Pending"];

      mockUsers.forEach((user) => {
        expect(validStatuses).toContain(user.status);
      });
    });

    it("created dates are in correct format (YYYY/MM/DD)", () => {
      const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

      mockUsers.forEach((user) => {
        expect(user.created).toMatch(dateRegex);
      });
    });

    it("emails are valid format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      mockUsers.forEach((user) => {
        expect(user.email).toMatch(emailRegex);
      });
    });
  });

  describe("fetchUsers", () => {
    it("returns a promise that resolves to user array", async () => {
      const users = await fetchUsers();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it("returns mock users data", async () => {
      const users = await fetchUsers();

      expect(users).toEqual(mockUsers);
    });

    it("simulates network delay", async () => {
      const startTime = Date.now();
      await fetchUsers();
      const endTime = Date.now();

      // Should take at least 500ms (with some tolerance)
      expect(endTime - startTime).toBeGreaterThanOrEqual(400);
    });
  });
});

