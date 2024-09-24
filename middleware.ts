import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Role } from "./lib/types/role.type"
import { JWTPayload, verifyJWT } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authCookie = request.cookies.get(
    process.env.NEXT_PUBLIC_TOKEN_COOKIE as string
  )
  const token = authCookie?.value
  let decodedToken: JWTPayload | null = null

  if (token) {
    decodedToken = await verifyJWT(token)
  }

  const protectedRoutes = {
    "/dashboard/student": [Role.STUDENT],
    "/mentor-search": [Role.STUDENT],
    "/dashboard/mentor": [Role.MENTOR],
  }

  const requiredRoles =
    protectedRoutes[pathname as keyof typeof protectedRoutes]

  if (requiredRoles) {
    if (!decodedToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (!decodedToken.role || !requiredRoles.includes(decodedToken.role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/mentor-search"],
}
