import { render, screen } from "@testing-library/react";
import { DashboardContent } from "../DashboardContent";

describe("DashboardContent", () => {
  it("renders user management title", () => {
    render(<DashboardContent />);

    expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<DashboardContent />);

    expect(
      screen.getByText("Manage and view all users in the system")
    ).toBeInTheDocument();
  });

  it("renders UserGrid component", () => {
    render(<DashboardContent />);

    // Check if table headers are present (indicating UserGrid is rendered)
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("displays mock users", () => {
    render(<DashboardContent />);

    // Check for some mock user data (using getAllByText since some names appear multiple times)
    expect(screen.getAllByText("Mila Kunis").length).toBeGreaterThan(0);
    expect(screen.getAllByText("George Clooney").length).toBeGreaterThan(0);
    expect(screen.getByText("Emma Watson")).toBeInTheDocument();
    expect(screen.getByText("Robert Downey Jr.")).toBeInTheDocument();
  });
});

