import { render, screen, fireEvent } from "@testing-library/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthButton } from "../AuthButton";

// Mock next-auth/react
jest.mock("next-auth/react");

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

// Create mock functions for router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();
const mockBack = jest.fn();

// Mock useRouter with our mock functions
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("AuthButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockPrefetch.mockClear();
    mockBack.mockClear();
  });

  it("renders loading state when session is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    render(<AuthButton />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders sign in button when user is not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    render(<AuthButton />);

    const signInButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    expect(signInButton).toBeInTheDocument();

    fireEvent.click(signInButton);
    expect(mockSignIn).toHaveBeenCalledWith("google");
  });

  it("renders user info and buttons when user is authenticated", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
      },
    };

    mockUseSession.mockReturnValue({
      data: mockSession,
      status: "authenticated",
    } as any);

    render(<AuthButton />);

    expect(screen.getByText(/signed in as test@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("navigates to dashboard when 'Go to Dashboard' is clicked", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      },
      status: "authenticated",
    } as any);

    render(<AuthButton />);

    const dashboardButton = screen.getByRole("button", { name: /go to dashboard/i });
    fireEvent.click(dashboardButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("calls signOut when 'Sign Out' is clicked", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      },
      status: "authenticated",
    } as any);

    render(<AuthButton />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });
});

