import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Role } from "./lib/types/role.type"
import { getRequestUser } from "./lib/crypto/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const user = await getRequestUser(request)

  const protectedRoutes = {
    "/dashboard/student": [Role.STUDENT],
    "/mentor-search": [Role.STUDENT],
    "/dashboard/mentor": [Role.MENTOR],
  }

  const requiredRoles =
    protectedRoutes[pathname as keyof typeof protectedRoutes]

  if (requiredRoles) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (!user.role || !requiredRoles.includes(user.role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/mentor-search"],
}
