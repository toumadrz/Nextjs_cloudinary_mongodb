import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // ไม่มี 
  if (pathname === '/welcome' && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }

  // Continue with the request if the user is an admin or the route is not protected
  return NextResponse.next()
}

export const config = {
  matcher: ['/welcome', '/login', '/register'],
}