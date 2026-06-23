import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
const privatePath = ["/manage"];
const unAuthPath = ["/login"];
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value || "";
  const { pathname } = request.nextUrl;
  //Nếu chưa đăng nhập mà người dùng vào trang quản lí thì redirect về login
  if (!refreshToken && privatePath.some((path) => pathname.startsWith(path)))
    return NextResponse.redirect(new URL("/login", request.url));
  //Nếu accessToken hết hạn mà vẫn còn đăng nhập thì logout
  if (
    !accessToken &&
    refreshToken &&
    privatePath.some((path) => pathname.startsWith(path))
  ) {
    const url = new URL("/logout",request.url);
    url.searchParams.set("refreshToken", refreshToken);
    return NextResponse.redirect(url);
  }
  if (refreshToken && unAuthPath.some((path) => pathname.startsWith(path)))
    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [`/manage/:path*`, "/login"],
};
