import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      localStorage.removeItem("access_token"); // ✅ hapus token di localStorage
      state.user = null;
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isHydrated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.user = null;
        state.isHydrated = true;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
