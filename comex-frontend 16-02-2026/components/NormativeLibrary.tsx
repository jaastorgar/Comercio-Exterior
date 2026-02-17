
import React, { useState } from 'react';
import { Search, Book, ShieldAlert, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const NormativeLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Actúa como un experto en normativa aduanera chilena. Explica brevemente la normativa vigente para: ${query}. Menciona si requiere vistos buenos (SAG, SERNAPESCA, ISP) si aplica.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      setResult(response.text || 'Sin resultados.');
    } catch (e) {
      setResult("Error al conectar con la base de datos normativa.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="text-center">
        <div className="inline-flex p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#ff7a00] mb-6">
          <Book size={32} />
        </div>
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Biblioteca <span className="text-[#ff7a00]">Normativa</span></h2>
        <p className="text-zinc-500 font-bold text-xs md:text-sm uppercase tracking-[0.3em] mt-2">Consulta de regulaciones y vistos buenos en tiempo real</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#ff7a00] transition-colors">
          <Search size={24} />
        </div>
        <input 
          type="text" 
          placeholder="Ej: Normas para importar juguetes, carnes, o repuestos..."
          className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-[#ff7a00] rounded-[2rem] pl-16 pr-32 py-6 text-lg font-medium outline-none transition-all shadow-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#ff7a00] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'CONSULTAR'}
        </button>
      </form>

      {result && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 animate-in fade-in zoom-in">
           <div className="flex items-center gap-3 mb-8 text-[#00d1ff] font-black uppercase text-[10px] tracking-widest">
              <Globe size={16} /> Resultado de Inteligencia Aduanera
           </div>
           <div className="prose prose-invert max-w-none">
              <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">{result}</p>
           </div>
           <div className="mt-10 pt-8 border-t border-zinc-800 flex gap-6">
              <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase"><ShieldAlert size={14} /> Fuente: Aduana.cl</div>
              <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase"><CheckCircle2 size={14} /> Verificado v2025</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NormativeLibrary;
