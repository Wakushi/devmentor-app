import { NextRequest, NextResponse } from "next/server"
import { executeContractWriteGasless } from "../(services)/contract.service"
import { getRequestUser } from "@/lib/crypto/jwt"
import { Role } from "@/lib/types/role.type"

const authorizedGaslessMethods = [
  "registerMentorAdmin",
  "registerStudentAdmin",
  "createSessionAdmin",
]

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { functionName, args } = await req.json()

    const user = await getRequestUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!authorizedGaslessMethods.includes(functionName)) {
      return NextResponse.json(
        { error: "Unauthorized contract method" },
        { status: 401 }
      )
    }

    switch (functionName) {
      case "registerMentorAdmin":
      case "registerStudentAdmin":
        if (user.role !== Role.VISITOR) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        break
      case "createSessionAdmin":
        if (user.role !== Role.STUDENT) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        break
    }

    const hash = await executeContractWriteGasless({
      functionName,
      args,
    })

    return NextResponse.json({ success: true, data: hash }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
  }
}
