import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Tambah reducer lain di sini jika ada
  },
});
if (typeof window !== "undefined") {
  (window as any).__REDUX_STATE__ = store.getState();
}

// Hook untuk digunakan di komponen
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
