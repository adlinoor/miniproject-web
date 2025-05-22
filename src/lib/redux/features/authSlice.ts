import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api-client";
import { IUser } from "@/interfaces/user.interface";
import { setCookie, deleteCookie } from "cookies-next";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean; // ✅ Tambahan
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isHydrated: false,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        secure: false,
      });
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      role: "CUSTOMER" | "ORGANIZER";
      referralCode?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/register", userData);
      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        secure: false,
      });
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/me");
      return res.data;
    } catch {
      return rejectWithValue("Unauthorized");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isHydrated = true;
    },
    logout(state) {
      deleteCookie("access_token");
      localStorage.removeItem("token");
      state.user = null;
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isHydrated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isHydrated = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isHydrated = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isHydrated = true;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
