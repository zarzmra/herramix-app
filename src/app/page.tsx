"use client";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [orig, setOrig] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrig(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);
    try {
      const blob = await removeBackground(file);
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      alert("Error: " + err);
    }
    setLoading(false);
  }
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-bold mt-10">Herramix - Quita Fondo</h1>
      <input type="file" accept="image/*" onChange={handleFile} className="bg-white text-black p-3 rounded" />
      {loading && <p>Quitando fondo... tarda 10s primera vez</p>}
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {orig && <div><p>Original</p><img src={orig} className="rounded" /></div>}
        {result && <div><p>Sin fondo</p><img src={result} className="rounded bg-white" />
        <a href={result} download="sin-fondo.png" className="block mt-3 bg-green-500 text-center p-3 rounded font-bold">DESCARGAR PNG</a>
        </div>}
      </div>
    </main>
  );
}
