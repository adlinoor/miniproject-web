import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./interfaces/user.interface";

// Middleware does not support 'cookies()' in this context reliably, so use req.cookies
const protectedRoutes = [
  { path: "/dashboard/organizer", roles: ["ORGANIZER"] },
  { path: "/dashboard/customer", roles: ["CUSTOMER"] },
  { path: "/profile", roles: ["CUSTOMER", "ORGANIZER"] },
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const route = protectedRoutes.find((r) => pathname.startsWith(r.path));

  if (!route) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  let user: IUser;
  try {
    user = jwtDecode(token);
  } catch {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (!route.roles.includes(user.role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile"],
};
