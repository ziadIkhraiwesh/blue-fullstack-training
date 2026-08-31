import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  createPinia,
  setActivePinia
} from "pinia";

import {
  loginUser,
  logoutUser
} from "../services/authApi";
import { useAuthStore } from "../stores/auth";

vi.mock("../services/authApi", () => ({
  loginUser: vi.fn(),
  fetchAuthenticatedUser: vi.fn(),
  logoutUser: vi.fn()
}));

describe("auth store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("stores the user and token after login", async () => {
    loginUser.mockResolvedValue({
      token: "test-access-token",
      user: {
        id: 1,
        name: "Test User A",
        email: "usera@example.com"
      }
    });

    const store = useAuthStore();

    const wasSuccessful = await store.login({
      email: "usera@example.com",
      password: "Password123!"
    });

    expect(wasSuccessful).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.user.name).toBe("Test User A");
    expect(
      localStorage.getItem("nexatech-auth-token")
    ).toBe("test-access-token");
  });

  it("clears authentication after logout", async () => {
    logoutUser.mockResolvedValue({
      status: "success"
    });

    localStorage.setItem(
      "nexatech-auth-token",
      "test-access-token"
    );

    const store = useAuthStore();

    store.token = "test-access-token";
    store.user = {
      id: 1,
      name: "Test User A"
    };

    await store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(
      localStorage.getItem("nexatech-auth-token")
    ).toBeNull();
  });
});