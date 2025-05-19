import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./interfaces/user.interface";

const protectedRoutes = [
  { path: "/dashboard/organizer", roles: ["ORGANIZER"] },
  { path: "/dashboard/customer", roles: ["CUSTOMER"] },
  { path: "/profile", roles: ["CUSTOMER", "ORGANIZER"] },
];

export default async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies(); // ✅ FIXED
    const token = cookieStore.get("access_token")?.value;

    const matched = protectedRoutes.find((r) =>
      req.nextUrl.pathname.startsWith(r.path)
    );

    if (!matched) return NextResponse.next();

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    let user: IUser;
    try {
      user = jwtDecode(token);
    } catch {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (!matched.roles.includes(user.role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile"],
};
