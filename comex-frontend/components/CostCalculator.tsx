
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Info, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

const CostCalculator: React.FC = () => {
  const [fob, setFob] = useState<number>(15000);
  const [freight, setFreight] = useState<number>(2450);
  const [insuranceRate, setInsuranceRate] = useState<number>(0.02); // 2%
  const [adValorem, setAdValorem] = useState<number>(0.06); // 6% Standard
  
  // Derived values
  const [insurance, setInsurance] = useState(0);
  const [cif, setCif] = useState(0);
  const [duty, setDuty] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedInsurance = fob * insuranceRate;
    const calculatedCif = fob + freight + calculatedInsurance;
    const calculatedDuty = calculatedCif * adValorem;
    const calculatedIva = (calculatedCif + calculatedDuty) * 0.19; // Chile 19%
    
    setInsurance(calculatedInsurance);
    setCif(calculatedCif);
    setDuty(calculatedDuty);
    setIva(calculatedIva);
    setTotal(calculatedCif + calculatedDuty + calculatedIva);
  }, [fob, freight, insuranceRate, adValorem]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-1 rounded-3xl shadow-2xl">
        <div className="bg-white rounded-[22px] p-8 text-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="text-[#ff7a00]" size={32} strokeWidth={2.5} />
            <h2 className="text-3xl font-black">Calculadora de Costeo de Importación</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Inputs */}
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-4 border-b pb-2">Datos de Origen</h3>
              
              <div className="space-y-4">
                <InputField 
                  label="Valor FOB (Mercadería)" 
                  value={fob} 
                  onChange={setFob} 
                  icon={<DollarSign size={18} />} 
                />
                <InputField 
                  label="Flete Internacional" 
                  value={freight} 
                  onChange={setFreight} 
                  icon={<Truck size={18} />} 
                />
                <InputField 
                  label="Tasa de Seguro (%)" 
                  value={insuranceRate * 100} 
                  onChange={(v) => setInsuranceRate(v / 100)} 
                  icon={<ShieldCheck size={18} />} 
                />
                <div className="pt-4">
                  <label className="block text-sm font-bold text-zinc-500 mb-2">Arancel Ad-Valorem (Chile)</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-[#ff7a00]"
                    value={adValorem}
                    onChange={(e) => setAdValorem(parseFloat(e.target.value))}
                  >
                    <option value={0.06}>Estándar (6%)</option>
                    <option value={0}>TLC Acuerdo (0%)</option>
                    <option value={0.02}>Parcial (2%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                Resumen de Costos <Info size={16} />
              </h3>
              
              <div className="space-y-4">
                <ResultRow label="FOB Base" value={formatCurrency(fob)} />
                <ResultRow label="Seguro (Prima)" value={formatCurrency(insurance)} />
                <div className="border-t border-zinc-200 my-2"></div>
                <ResultRow label="VALOR CIF" value={formatCurrency(cif)} isHighlight />
                <ResultRow label="Derecho Ad-Valorem" value={formatCurrency(duty)} />
                <ResultRow label="IVA Importación (19%)" value={formatCurrency(iva)} />
                
                <div className="mt-8 bg-[#1a1a1a] p-6 rounded-2xl text-white">
                  <span className="text-zinc-400 text-sm font-bold block mb-1">Costo Total Desaduanado</span>
                  <div className="text-3xl font-black text-[#00d1ff]">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string, value: number, onChange: (v: number) => void, icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <div>
    <label className="block text-sm font-bold text-zinc-500 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
        {icon}
      </div>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-12 pr-4 py-3 font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-[#ff7a00] transition-all"
      />
    </div>
  </div>
);

const ResultRow: React.FC<{ label: string, value: string, isHighlight?: boolean }> = ({ label, value, isHighlight }) => (
  <div className="flex justify-between items-center">
    <span className={`text-zinc-500 font-medium ${isHighlight ? 'text-[#1a1a1a] font-bold' : ''}`}>{label}</span>
    <span className={`font-bold ${isHighlight ? 'text-xl text-[#ff7a00]' : 'text-zinc-800'}`}>{value}</span>
  </div>
);

export default CostCalculator;
