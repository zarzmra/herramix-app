import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/png" }
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
