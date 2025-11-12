import { render, screen, fireEvent } from "@testing-library/react";
import { UserGrid, User } from "../UserGrid";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Admin",
    email: "john@example.com",
    created: "2023/01/01",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Member",
    email: "jane@example.com",
    created: "2023/02/15",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Bob Johnson",
    role: "Registered",
    email: "bob@example.com",
    created: "2023/03/20",
    status: "Banned",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

describe("UserGrid", () => {
  it("renders user table with correct headers", () => {
    render(<UserGrid users={mockUsers} />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders all users in the table", () => {
    render(<UserGrid users={mockUsers} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("displays user roles correctly", () => {
    render(<UserGrid users={mockUsers} />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Member")).toBeInTheDocument();
    expect(screen.getByText("Registered")).toBeInTheDocument();
  });

  it("displays user emails correctly", () => {
    render(<UserGrid users={mockUsers} />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("displays user creation dates correctly", () => {
    render(<UserGrid users={mockUsers} />);

    expect(screen.getByText("2023/01/01")).toBeInTheDocument();
    expect(screen.getByText("2023/02/15")).toBeInTheDocument();
    expect(screen.getByText("2023/03/20")).toBeInTheDocument();
  });

  it("displays correct status badges", () => {
    render(<UserGrid users={mockUsers} />);

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Banned")).toBeInTheDocument();
  });

  it("renders action buttons for each user", () => {
    render(<UserGrid users={mockUsers} />);

    // Each user should have 3 action buttons (view, edit, delete)
    const buttons = screen.getAllByRole("button");
    // 3 buttons per user * 3 users = 9 buttons
    expect(buttons.length).toBeGreaterThanOrEqual(9);
  });

  it("calls handleView when view button is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(<UserGrid users={mockUsers} />);

    const viewButtons = screen.getAllByLabelText("View user");
    fireEvent.click(viewButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith("View user:", "1");
    consoleSpy.mockRestore();
  });

  it("calls handleEdit when edit button is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(<UserGrid users={mockUsers} />);

    const editButtons = screen.getAllByLabelText("Edit user");
    fireEvent.click(editButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith("Edit user:", "1");
    consoleSpy.mockRestore();
  });

  it("calls handleDelete when delete button is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(<UserGrid users={mockUsers} />);

    const deleteButtons = screen.getAllByLabelText("Delete user");
    fireEvent.click(deleteButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith("Delete user:", "1");
    consoleSpy.mockRestore();
  });

  it("renders empty table when no users provided", () => {
    render(<UserGrid users={[]} />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    // Should not have any user names
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("renders user avatars", () => {
    render(<UserGrid users={mockUsers} />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(mockUsers.length);
  });
});

