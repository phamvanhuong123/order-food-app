import { Role } from "@/constants/type";
import { decodeToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
const managePath = ["/manage"];
const guestPath = ["/guest"];
const privatePath = [...managePath, ...guestPath];
const unAuthPath = ["/login"];
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value || "";
  const { pathname } = request.nextUrl;
  //Nếu chưa đăng nhập mà người dùng vào trang quản lí thì redirect về login
  if (!refreshToken && privatePath.some((path) => pathname.startsWith(path))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  if (refreshToken) {
    //Nếu accessToken hết hạn mà vẫn còn đăng nhập thì refreshToken
    if (!accessToken && privatePath.some((path) => pathname.startsWith(path))) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    //Nếu đã đăng nhập nhưng chuyển về login thì chuyển sang '/'
    if (refreshToken && unAuthPath.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    //Role Owner => Không được truy cập trang guest
    //Role Guest => Không được truy cập trang Owner
    const role = decodeToken(refreshToken).role
    const isGuestGoToManagePath = role === Role.Guest && managePath.some(path => pathname.startsWith(path))
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPath.some(path => pathname.startsWith(path))

    if(isGuestGoToManagePath || isNotGuestGoToGuestPath){
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [`/manage/:path*`,`/guest/:path*`, "/login"],
};
