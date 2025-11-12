import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { Navbar } from "../Navbar";

// Mock next-auth/react
jest.mock("next-auth/react");

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders app name", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    render(<Navbar />);

    expect(screen.getByText("MyApp")).toBeInTheDocument();
  });

  it("renders dashboard link when user is authenticated", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      },
      status: "authenticated",
    } as any);

    render(<Navbar />);

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("does not render dashboard link when user is not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    render(<Navbar />);

    expect(screen.queryByRole("link", { name: /dashboard/i })).not.toBeInTheDocument();
  });
});

