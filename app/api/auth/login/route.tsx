import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { getUserByAddress } from "../../(services)/user.service"
import { createUserJwtToken } from "@/lib/crypto/jwt"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { address, signature, nonce } = await req.json()

    const signerAddress = ethers.verifyMessage(nonce, signature)

    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const user = await getUserByAddress(address)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const token = await createUserJwtToken({
      address: user.account,
      role: user.role,
    })

    const response = NextResponse.json({ success: true, data: user })
    response.cookies.set(
      process.env.NEXT_PUBLIC_TOKEN_COOKIE as string,
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 1 week
        path: "/",
      }
    )

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
