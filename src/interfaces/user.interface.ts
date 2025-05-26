export interface IUser {
  userPoints: number;
  isVerified: boolean;
  profilePicture: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode?: string;
}
