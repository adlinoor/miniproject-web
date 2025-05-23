import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "@/app/auth/login/page";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/features/authSlice";

// 🔁 Mock router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// 🔁 Create mock store
const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

describe("LoginPage", () => {
  it("renders login page and submits form", () => {
    render(
      <Provider store={mockStore}>
        <LoginPage />
      </Provider>
    );

    // ⛳️ Gunakan placeholder daripada label karena tidak ada htmlFor + id
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByPlaceholderText(/you@example.com/i)).toHaveValue(
      "test@example.com"
    );
    expect(screen.getByPlaceholderText(/••••••••/i)).toHaveValue("password123");
  });
});
