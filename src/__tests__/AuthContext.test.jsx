import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

const mockGetMe = vi.fn();
const mockGetToken = vi.fn();

vi.mock("../api/auth", () => ({
  getMe: (...args) => mockGetMe(...args),
  login: vi.fn(),
  signup: vi.fn(),
}));

vi.mock("../utils/token", () => ({
  getToken: (...args) => mockGetToken(...args),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

function TestConsumer() {
  const ctx = useContext(AuthContext);
  return (
    <div>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="user">{ctx.user ? ctx.user.email : "null"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  it("starts with loading false and null user when no token", async () => {
    mockGetToken.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("user")).toHaveTextContent("null");
    });
  });

  it("sets user when a valid token exists", async () => {
    mockGetToken.mockReturnValue("valid_token");
    mockGetMe.mockResolvedValue({ data: { uid: "1", email: "a@b.com" } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("a@b.com");
    });
  });
});
