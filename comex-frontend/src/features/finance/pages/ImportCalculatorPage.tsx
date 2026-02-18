import React, { useState } from 'react';
import { financeService } from '../services/finance.service';
import { ImportSimulationResponse } from '../types/finance.types';
import '../styles/Finance.css';

const ImportCalculatorPage: React.FC = () => {
  // Estados para los inputs
  const [values, setValues] = useState({
    fob: '',
    freight: '',
    insurance: '',
    rate: '950' // Valor por defecto o traer de API Rates luego
  });

  const [result, setResult] = useState<ImportSimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await financeService.calculate({
        fob_value: Number(values.fob),
        freight_value: Number(values.freight),
        insurance_value: Number(values.insurance),
        exchange_rate: Number(values.rate)
      });
      setResult(response);
    } catch (error) {
      console.error("Error calculando", error);
      alert("Error al realizar el cálculo. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  // Formateador de moneda (Pesos Chilenos)
  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  // Formateador de moneda (Dólares)
  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="finance-container">
      <div className="finance-header">
        <h1 className="finance-title">Calculadora de Importación</h1>
        <p style={{ color: '#aaa' }}>Estima tus impuestos aduaneros y costo total según normativa chilena.</p>
      </div>

      <div className="calculator-layout">
        
        {/* FORMULARIO DE ENTRADA */}
        <div className="form-card">
          <form onSubmit={handleCalculate}>
            <div className="input-group">
              <label className="input-label">Valor FOB (Mercancía USD)</label>
              <input 
                type="number" name="fob" 
                className="currency-input" placeholder="0.00" 
                value={values.fob} onChange={handleChange} required 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Flete Internacional (USD)</label>
              <input 
                type="number" name="freight" 
                className="currency-input" placeholder="0.00" 
                value={values.freight} onChange={handleChange} required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Seguro (USD)</label>
              <input 
                type="number" name="insurance" 
                className="currency-input" placeholder="0.00" 
                value={values.insurance} onChange={handleChange} required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Tipo de Cambio (CLP)</label>
              <input 
                type="number" name="rate" 
                className="currency-input" 
                value={values.rate} onChange={handleChange} required 
              />
            </div>

            <button type="submit" className="btn-calculate" disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular Costos'}
            </button>
          </form>
        </div>

        {/* RESULTADOS */}
        {result && (
          <div className="result-card">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Desglose de Costos</h3>
            
            <div className="result-row">
              <span className="result-label">Valor CIF (USD)</span>
              <span className="result-value" style={{ color: '#4A6CFF' }}>{formatUSD(result.cif_value)}</span>
            </div>
            
            <div className="result-row">
              <span className="result-label">Valor CIF (CLP)</span>
              <span className="result-value">{formatCLP(result.cif_clp)}</span>
            </div>

            <hr style={{ borderColor: '#333', margin: '10px 0' }} />
            
            <div className="result-row">
              <span className="result-label">Derecho Ad Valorem (6%)</span>
              <span className="result-value" style={{ color: '#ff4444' }}>+ {formatCLP(result.ad_valorem)}</span>
            </div>
            
            <div className="result-row">
              <span className="result-label">IVA (19%)</span>
              <span className="result-value" style={{ color: '#ff4444' }}>+ {formatCLP(result.iva)}</span>
            </div>

            <div className="total-row">
              <span>Costo Total Importación</span>
              <span className="total-value">{formatCLP(result.total_cost)}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ImportCalculatorPage;