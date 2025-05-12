import axios from "axios";
import { IUser } from "@/interfaces/user.interface";

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: IUser }> => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode?: string;
}): Promise<{ token: string; user: IUser }> => {
  const response = await axios.post("/auth/register", userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<IUser> => {
  const response = await axios.get("/users/me");
  return response.data;
};
