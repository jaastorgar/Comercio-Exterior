
import React, { useState } from 'react';
import { ArrowLeftRight, Ship, Truck, Factory, ShieldCheck, User, Package } from 'lucide-react';

const INCOTERMS = [
  { id: 'EXW', name: 'Ex Works', seller: 'Fabrica', buyer: 'Todo el trayecto', desc: 'Mínima obligación para el vendedor.' },
  { id: 'FOB', name: 'Free On Board', seller: 'Hasta borda del buque', buyer: 'Flete y destino', desc: 'Exclusivo para transporte marítimo.' },
  { id: 'CIF', name: 'Cost, Insurance & Freight', seller: 'Hasta puerto destino + Seguro', buyer: 'Descarga y local', desc: 'El vendedor paga el seguro mínimo.' },
  { id: 'DDP', name: 'Delivered Duty Paid', seller: 'Hasta puerta del comprador', buyer: 'Nada (recepción)', desc: 'Máxima obligación para el vendedor.' },
];

const IncotermsSimulator: React.FC = () => {
  const [selected, setSelected] = useState(INCOTERMS[1]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">Simulador de <span className="text-[#ff7a00]">Responsabilidades</span></h2>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">Incoterms 2020 • Transferencia de Riesgos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {INCOTERMS.map(inc => (
            <button 
              key={inc.id}
              onClick={() => setSelected(inc)}
              className={`w-full p-6 rounded-2xl border transition-all text-left group ${selected.id === inc.id ? 'bg-[#ff7a00] border-transparent text-white shadow-xl' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              <div className="text-2xl font-black italic">{inc.id}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{inc.name}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-white italic uppercase">{selected.name}</h3>
              <p className="text-zinc-400 font-medium text-lg leading-relaxed">{selected.desc}</p>
            </div>

            <div className="mt-12 space-y-10">
              <div className="relative h-2 bg-zinc-800 rounded-full">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 flex justify-between w-full px-2">
                  <div className="flex flex-col items-center">
                    <Factory className="text-white mb-2" size={24} />
                    <span className="text-[8px] font-black uppercase text-zinc-500">Origen</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Ship className="text-white mb-2" size={24} />
                    <span className="text-[8px] font-black uppercase text-zinc-500">Puerto</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <User className="text-white mb-2" size={24} />
                    <span className="text-[8px] font-black uppercase text-zinc-500">Destino</span>
                  </div>
                </div>
                <div 
                  className="absolute h-full bg-[#ff7a00] rounded-full transition-all duration-1000 shadow-[0_0_15px_#ff7a00]" 
                  style={{ width: selected.id === 'EXW' ? '10%' : selected.id === 'FOB' ? '50%' : selected.id === 'CIF' ? '80%' : '100%' }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-black/40 rounded-3xl border border-zinc-800">
                    <div className="text-[#ff7a00] font-black text-[10px] uppercase mb-2">Vendedor Paga</div>
                    <p className="text-white text-sm font-bold">{selected.seller}</p>
                 </div>
                 <div className="p-6 bg-black/40 rounded-3xl border border-zinc-800">
                    <div className="text-[#00d1ff] font-black text-[10px] uppercase mb-2">Comprador Paga</div>
                    <p className="text-white text-sm font-bold">{selected.buyer}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncotermsSimulator;
