import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "@/app/auth/forgot-password/page";
import authService from "@/services/auth.service";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

describe("ForgotPasswordPage", () => {
  it("should call forgotPassword when form is submitted", async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { message: "Reset link sent" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {},
      } as InternalAxiosRequestConfig,
    };

    const mockForgot = vi
      .spyOn(authService, "forgotPassword")
      .mockResolvedValue(mockResponse as AxiosResponse);

    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockForgot).toHaveBeenCalledWith("test@example.com");
    });
  });
});
