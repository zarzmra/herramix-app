import { NextRequest, NextResponse } from "next/server"
import { removeBackground } from "@imgly/background-removal-node"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Esta librería está hecha para Node, no se crashea
    const result = await removeBackground(buffer)

    return new NextResponse(result as any, {
      headers: { "Content-Type": "image/png" }
    })
  } catch (e: any) {
    console.error("ERROR:", e)
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
