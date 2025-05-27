import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResetPasswordPage from "@/app/reset-password/[token]/page";
import * as router from "next/navigation";
import * as toast from "react-hot-toast";
import api from "@/lib/api-client";

vi.mock("next/navigation", () => ({
  useParams: () => ({ token: "dummytoken123" }),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("ResetPasswordPage", () => {
  it("should submit new password", async () => {
    vi.spyOn(api, "post").mockResolvedValueOnce({ data: {} });

    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(api.post).toHaveBeenCalledWith("/reset-password/dummytoken123", {
      password: "newpassword",
    });
  });
});
