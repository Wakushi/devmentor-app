import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Role } from "./lib/types/role.type"
import { getRequestUser } from "./lib/crypto/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const user = await getRequestUser(request)

  const protectedRoutes = {
    student: Role.STUDENT,
    mentor: Role.MENTOR,
  }

  const mainPath = pathname.split("/")[1]
  const requiredRole = protectedRoutes[mainPath as keyof typeof protectedRoutes]

  if (requiredRole) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (!user.role || requiredRole !== user.role) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*"],
}
