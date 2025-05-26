import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/api-client";
import AxiosMockAdapter from "axios-mock-adapter";
const apiMock = new AxiosMockAdapter(api);

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/auth/register/page";

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("RegisterPage (Referral)", () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it("shows Referral Code input", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/Referral Code/i)).toBeInTheDocument();
  });

  it("submits valid referral code", async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText(/First Name/i), "John");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
    await userEvent.type(
      screen.getByLabelText(/Email/i),
      "referraltest@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/Password/i, { selector: "input" }),
      "passwordmu"
    );
    await userEvent.type(screen.getByLabelText(/Referral Code/i), "REF-ABCDE");
    await userEvent.selectOptions(
      screen.getByLabelText(/Register as/i),
      "CUSTOMER"
    );
    apiMock
      .onPost("/api/auth/register")
      .reply(200, { user: { id: 1, role: "CUSTOMER" }, token: "mocktoken" });
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(apiMock.history.post.length).toBe(1);
      const sent = JSON.parse(apiMock.history.post[0].data);
      expect(sent.referralCode).toBe("REF-ABCDE");
    });
  });

  it("shows error for invalid referral code (from backend)", async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText(/First Name/i), "Jane");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
    await userEvent.type(
      screen.getByLabelText(/Email/i),
      "invalidreferral@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/Password/i, { selector: "input" }),
      "password123"
    );
    await userEvent.type(
      screen.getByLabelText(/Referral Code/i),
      "REF-INVALID"
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/Register as/i),
      "CUSTOMER"
    );
    apiMock
      .onPost("/api/auth/register")
      .reply(400, { message: "Invalid referral code" });
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(apiMock.history.post.length).toBe(1);
      const sent = JSON.parse(apiMock.history.post[0].data);
      expect(sent.referralCode).toBe("REF-INVALID");
    });
  });

  it("registers user without referral code", async () => {
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText(/First Name/i), "No");
    await userEvent.type(screen.getByLabelText(/Last Name/i), "Referral");
    await userEvent.type(screen.getByLabelText(/Email/i), "noref@example.com");
    await userEvent.type(
      screen.getByLabelText(/Password/i, { selector: "input" }),
      "password123"
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/Register as/i),
      "CUSTOMER"
    );
    apiMock
      .onPost("/api/auth/register")
      .reply(200, { user: { id: 2, role: "CUSTOMER" }, token: "mocktoken2" });
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(apiMock.history.post.length).toBe(1);
      const sent = JSON.parse(apiMock.history.post[0].data);
      expect(sent.referralCode).toBeFalsy();
    });
  });
});
