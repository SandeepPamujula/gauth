// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Next.js router - individual tests can override this
// Default implementation for tests that don't need to track router calls
jest.mock("next/navigation", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockPrefetch = jest.fn();
  const mockBack = jest.fn();

  return {
    useRouter: jest.fn(() => ({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
      back: mockBack,
    })),
    usePathname: jest.fn(() => "/"),
    useSearchParams: jest.fn(() => new URLSearchParams()),
  };
});

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // Remove unoptimized prop to avoid React warning
    const { unoptimized, ...restProps } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...restProps} />;
  },
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

