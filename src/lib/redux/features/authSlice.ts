import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IUser} from "../../../interfaces/user.interface";

export interface IAuth {
  user: IUser;
  isLogin?: boolean;
}

const initialState: IAuth = {
  user: {
    email: "",
    first_name: "",
    last_name: "",
    role: "",
  },
  isLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: IAuth, action: PayloadAction<IAuth>) => {
        state.user = action.payload.user;
        state.isLogin = true;
    },
    logout: (state: IAuth) => {
        state.isLogin = false;
        localStorage.removeItem("access_token");
    },
  },
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;
