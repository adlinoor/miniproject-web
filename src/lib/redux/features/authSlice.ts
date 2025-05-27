import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api-client";
import { IUser } from "@/interfaces/user.interface";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isHydrated: false,
};

// Utility untuk cek cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, maxAgeSeconds = 60) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
}

// Async thunk untuk fetch profile user
export const getProfile = createAsyncThunk<IUser>(
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
    login(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isHydrated = true;
      document.cookie = "logged_out=; Max-Age=0; path=/";
    },
    logout(state) {
      state.user = null;
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isHydrated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.isHydrated = true;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
