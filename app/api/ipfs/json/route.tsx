import { NextRequest, NextResponse } from "next/server"
import { pinJSONToIPFS, unpinFile } from "../../(services)/ipfs.service"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { json, filename } = body

    const ipfsHash = await pinJSONToIPFS(json, filename)

    return new NextResponse(JSON.stringify({ ipfsHash }))
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { hash } = body
    await unpinFile(hash)

    return new NextResponse(JSON.stringify({ message: "Ok" }))
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
  }
}
