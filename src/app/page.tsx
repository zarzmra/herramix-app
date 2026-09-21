"use client"
import { useState } from "react"
import { removeBackground } from "@imgly/background-removal"
import { motion } from "framer-motion"

export default function Home() {
  const [img, setImg] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file: File) => {
    setImg(URL.createObjectURL(file))
    setLoading(true)
    try {
      const blob = await removeBackground(file)
      setResult(URL.createObjectURL(blob))
    } catch(e){ console.error(e); alert("Error") }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <header className="flex justify-between max-w-7xl mx-auto py-4"><h1 className="text-xl font-bold">herramix.app</h1><span className="text-sm bg-purple-500/20 px-3 py-1 rounded-full">Beta</span></header>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-5xl mx-auto mt-20 text-center">
        <h2 className="text-5xl font-bold">Remove Backgrounds <span className="text-purple-400">in Seconds</span></h2>
        <p className="mt-4 text-gray-400">IA 100% privada, gratis, sin marca de agua</p>
        <div className="mt-10 border-2 border-dashed border-purple-500/30 rounded-2xl p-10 bg-white/5">
          <input type="file" id="f" hidden onChange={e=> e.target.files && handleFile(e.target.files[0])} accept="image/*" />
          <label htmlFor="f" className="cursor-pointer"><div className="text-6xl mb-4">↑</div><p className="text-xl font-bold">Arrastra tu imagen aquí</p><p className="text-sm text-gray-400">PNG, JPG hasta 10MB</p></label>
          {loading && <p className="mt-6 text-purple-400 animate-pulse">Procesando con IA...</p>}
          {img && result && (<div className="grid grid-cols-2 gap-4 mt-8"><div><p className="text-sm mb-2">Original</p><img src={img} className="rounded-xl" /></div><div><p className="text-sm mb-2">Sin fondo</p><img src={result} className="rounded-xl bg-[url('https://i.imgur.com/8Km9tLL.png')]" /></div></div>)}
          {result && <a href={result} download="herramix-sin-fondo.png" className="mt-6 inline-block bg-purple-600 px-8 py-3 rounded-full font-bold">Descargar PNG</a>}
        </div>
      </motion.div>
    </div>
  )
}
