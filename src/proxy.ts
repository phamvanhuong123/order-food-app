import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
const privatePath =[ '/manage']
const unAuthPath = ['/login']
export async function proxy (request: NextRequest) {
  
  const accessToken =  request.cookies.get('accessToken')?.value
  const isAuth = Boolean(accessToken)
  const {pathname} = request.nextUrl
  //Nếu chưa đăng nhập mà người dùng vào trang quản lí thì redirect về login
  if(!isAuth && privatePath.some(path => pathname.startsWith(path))) return NextResponse.redirect(new URL('/login', request.url))
  if(isAuth && unAuthPath.some(path => pathname.startsWith(path))) return NextResponse.redirect(new URL('/', request.url))

  return NextResponse.next()
}
 
export const config = {
  matcher: [`/manage/:path*`,'/login'],
}