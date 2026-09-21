import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Cargar IA (solo la primera vez tarda)
    const { pipeline, env, RawImage } = await import("@xenova/transformers")
    env.allowLocalModels = false

    const segmenter = await pipeline("image-segmentation", "Xenova/modnet", {
      quantized: true,
    })

    const image = await RawImage.fromBlob(file)
    // @ts-ignore
    const result = await segmenter(image)

    // result es un array, el mask es la máscara
    let mask = result
    if (Array.isArray(result)) mask = result[0].mask || result[0]
    if (mask.mask) mask = mask.mask

    // Convertir máscara a buffer PNG
    const maskData = mask.data
    const width = mask.width
    const height = mask.height

    // Crear imagen de máscara en escala de grises
    const maskBuffer = await sharp(maskData, {
      raw: { width, height, channels: 1 }
    }).png().toBuffer()

    // Aplicar máscara como canal alpha a la imagen original
    const originalMeta = await sharp(buffer).metadata()

    const output = await sharp(buffer)
     .resize(width, height)
     .ensureAlpha()
     .composite([{
        input: maskBuffer,
        blend: 'dest-in'
      }])
     .png()
     .toBuffer()

    return new NextResponse(output, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache"
      }
    })

  } catch (e) {
    console.error("ERROR REAL:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
