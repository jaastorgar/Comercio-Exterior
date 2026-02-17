
import React, { useState } from 'react';
import { Map as MapIcon, Globe, ShieldCheck, Ship, Info, ExternalLink, Loader2, Anchor } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface PortInfo {
  name: string;
  description: string;
  links: { title: string; uri: string }[];
  loading: boolean;
}

const CHILEAN_PORTS = [
  { id: 'arica', name: 'Puerto Arica', lat: '15%', top: '5%', region: 'XV' },
  { id: 'iquique', name: 'Puerto Iquique', lat: '16%', top: '12%', region: 'I' },
  { id: 'antofagasta', name: 'Puerto Antofagasta', lat: '18%', top: '22%', region: 'II' },
  { id: 'valparaiso', name: 'Puerto Valparaíso', lat: '24%', top: '48%', region: 'V' },
  { id: 'san-antonio', name: 'Puerto San Antonio', lat: '25%', top: '52%', region: 'V' },
  { id: 'talcahuano', name: 'Puerto Talcahuano', lat: '26%', top: '65%', region: 'VIII' },
  { id: 'punta-arenas', name: 'Puerto Punta Arenas', lat: '45%', top: '92%', region: 'XII' },
];

const MapModule: React.FC = () => {
  const [selectedPort, setSelectedPort] = useState<typeof CHILEAN_PORTS[0] | null>(null);
  const [portDetails, setPortDetails] = useState<PortInfo | null>(null);

  const fetchPortData = async (port: typeof CHILEAN_PORTS[0]) => {
    setSelectedPort(port);
    setPortDetails({ name: port.name, description: '', links: [], loading: true });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: `Proporciona un resumen técnico y profesional del ${port.name} en Chile. Incluye su importancia logística, capacidad principal y noticias recientes si las hay. Sé breve y ejecutivo.`,
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
        },
      });

      const text = response.text || "No se pudo obtener información en este momento.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      const links = chunks
        .filter((chunk: any) => chunk.web || chunk.maps)
        .map((chunk: any) => ({
          title: chunk.web?.title || chunk.maps?.title || "Enlace Oficial",
          uri: chunk.web?.uri || chunk.maps?.uri
        }));

      setPortDetails({
        name: port.name,
        description: text,
        links: links.slice(0, 3),
        loading: false
      });
    } catch (error) {
      console.error("Error fetching port data:", error);
      setPortDetails({
        name: port.name,
        description: "Error al conectar con la red de inteligencia aduanera. Por favor reintente.",
        links: [],
        loading: false
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
            Red Portuaria <span className="text-[#ff7a00]">Chile</span>
          </h2>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">
            Inteligencia Logística en Tiempo Real • Grounding de Datos
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800 shadow-xl">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Terminales Operativos: 7</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
        {/* Geographic Map Container */}
        <div className="lg:col-span-7 bg-[#050505] rounded-[2.5rem] border border-zinc-800 p-6 md:p-12 relative overflow-hidden flex items-center justify-center group shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff7a00_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative h-full flex items-center justify-center">
            {/* Realistic Simplified Chile SVG Path */}
            <svg viewBox="0 0 400 1000" className="h-[600px] md:h-[800px] w-auto drop-shadow-[0_0_30px_rgba(255,122,0,0.1)]">
              <path 
                d="M180,20 L195,40 L190,80 L185,150 L188,220 L192,300 L205,380 L210,450 L208,520 L215,600 L220,680 L230,750 L250,850 L280,920 L270,950 L260,980 L230,960 L200,900 L180,800 L175,700 L170,600 L168,500 L165,400 L162,300 L165,200 L170,100 L175,50 L180,20" 
                fill="#111" 
                stroke="#333" 
                strokeWidth="2"
              />
              <path 
                d="M180,20 L195,40 L190,80 L185,150 L188,220 L192,300 L205,380 L210,450 L208,520 L215,600 L220,680 L230,750 L250,850 L280,920 L270,950 L260,980 L230,960 L200,900 L180,800 L175,700 L170,600 L168,500 L165,400 L162,300 L165,200 L170,100 L175,50 L180,20" 
                fill="none" 
                stroke="#ff7a00" 
                strokeWidth="1"
                className="opacity-20"
              />
            </svg>
            
            {/* Interactive Port Markers */}
            {CHILEAN_PORTS.map(port => (
              <div 
                key={port.id}
                className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group/port"
                style={{ left: port.lat, top: port.top }}
                onClick={() => fetchPortData(port)}
              >
                <div className={`relative flex items-center justify-center`}>
                  <div className={`absolute w-8 h-8 rounded-full bg-[#ff7a00]/20 animate-ping ${selectedPort?.id === port.id ? 'opacity-100' : 'opacity-0 group-hover/port:opacity-100'}`} />
                  <div className={`w-3 h-3 rounded-full border-2 border-white transition-all shadow-xl ${selectedPort?.id === port.id ? 'bg-[#ff7a00] scale-150' : 'bg-zinc-800 group-hover/port:bg-[#00d1ff]'}`} />
                </div>
                <div className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-black uppercase transition-all ${selectedPort?.id === port.id ? 'text-[#ff7a00] scale-110 translate-x-1' : 'text-zinc-500 opacity-0 group-hover/port:opacity-100'}`}>
                   {port.name} <span className="text-zinc-600 ml-1">Región {port.region}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-8 left-8 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
               <Anchor size={14} className="text-[#ff7a00]" />
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nodos Estratégicos</span>
            </div>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {portDetails ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-3xl h-full flex flex-col relative overflow-hidden animate-in slide-in-from-right-4">
              {portDetails.loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20">
                  <div className="relative">
                     <Loader2 size={64} className="text-[#ff7a00] animate-spin" />
                     <Ship size={24} className="absolute inset-0 m-auto text-[#00d1ff]" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black uppercase italic text-white mb-2">Consultando Sistema Aduanero</h3>
                    <p className="text-zinc-500 text-xs font-bold animate-pulse">RASTREANDO DATOS EN TIEMPO REAL...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-[#ff7a00] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Ship size={14} /> Puerto Validado
                    </div>
                    <span className="text-zinc-600 text-xs font-bold uppercase tracking-tighter">Lat: {selectedPort?.lat}</span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
                    {portDetails.name}
                  </h3>

                  <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                    <div className="bg-black/40 p-6 rounded-3xl border border-zinc-800">
                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
                        {portDetails.description}
                      </p>
                    </div>

                    {portDetails.links.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                          <Globe size={12} /> Fuentes y Enlaces Oficiales
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {portDetails.links.map((link, i) => (
                            <a 
                              key={i}
                              href={link.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-white/5 transition-all group"
                            >
                              <span className="text-xs font-bold text-zinc-300 truncate pr-4">{link.title}</span>
                              <ExternalLink size={14} className="text-[#ff7a00] group-hover:scale-125 transition-transform" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-black/20 rounded-2xl border border-zinc-800">
                          <span className="text-[8px] font-black text-zinc-600 uppercase">Capacidad Est.</span>
                          <div className="text-sm font-black text-white">ZONA PRIMARIA</div>
                       </div>
                       <div className="p-4 bg-black/20 rounded-2xl border border-zinc-800">
                          <span className="text-[8px] font-black text-zinc-600 uppercase">Estado Red</span>
                          <div className="text-sm font-black text-emerald-500">CONECTADO</div>
                       </div>
                    </div>
                  </div>

                  <button className="w-full mt-10 bg-[#ff7a00] hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-xs tracking-widest uppercase">
                    Generar Reporte de Arribo <ExternalLink size={18} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] group">
              <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-700 mb-8 group-hover:scale-110 transition-transform duration-500 border border-zinc-800">
                <MapIcon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">Geolocalización Inactiva</h3>
              <p className="text-zinc-500 text-sm font-medium max-w-xs">
                Selecciona un nodo portuario en el mapa para sincronizar la inteligencia aduanera.
              </p>
              
              <div className="mt-10 flex gap-4">
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapModule;
