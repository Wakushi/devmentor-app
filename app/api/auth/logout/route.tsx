import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out" })

  response.cookies.set({
    name: process.env.NEXT_PUBLIC_TOKEN_COOKIE as string,
    value: "",
    httpOnly: true,
    maxAge: -1,
    path: "/",
  })

  return response
}
