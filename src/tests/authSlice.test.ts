import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  login,
  logout,
  getProfile,
} from "@/lib/redux/features/authSlice";
import { IUser } from "@/interfaces/user.interface";
import MockAdapter from "axios-mock-adapter";
import api from "@/lib/api-client";

// Setup mock API
const mock = new MockAdapter(api);
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

describe("authSlice", () => {
  const mockUser: IUser = {
    id: 1,
    first_name: "Adli",
    last_name: "Noor",
    email: "adli@example.com",
    profilePicture: "",
    role: "CUSTOMER",
  };

  beforeEach(() => {
    store.dispatch(logout());
    mock.reset(); // ✅ clear mock
    localStorage.clear();
  });

  it("should fetch profile successfully", async () => {
    mock.onGet("/users/me").reply(200, mockUser); // ✅ benar ke endpoint /users/me
    await store.dispatch(getProfile() as any);
    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.isHydrated).toBe(true);
  });

  it("should logout user", () => {
    store.dispatch(login(mockUser));
    store.dispatch(logout());
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.isHydrated).toBe(true);
  });

  it("should fetch profile successfully", async () => {
    mock.onGet("/users/me").reply(200, mockUser);
    await store.dispatch(getProfile() as any);
    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.isHydrated).toBe(true);
  });

  it("should handle profile fetch error", async () => {
    mock.onGet("/users/me").reply(401);
    await store.dispatch(getProfile() as any);
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.isHydrated).toBe(true);
  });
});
