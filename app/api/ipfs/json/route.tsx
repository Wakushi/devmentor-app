import { NextRequest, NextResponse } from "next/server"
import { pinJSONToIPFS, unpinFile } from "../../(services)/ipfs.service"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { json } = await req.json()
    const timestamp = Date.now().toString()

    const ipfsHash = await pinJSONToIPFS(json, timestamp)

    return NextResponse.json({ success: true, data: ipfsHash }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { hash } = body
    await unpinFile(hash)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
  }
}
