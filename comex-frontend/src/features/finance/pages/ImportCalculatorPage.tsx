import React, { useState } from 'react';
import { financeService } from '../services/finance.service';
import { ImportSimulationResponse } from '../types/finance.types';
import '../styles/Finance.css';

const ImportCalculatorPage: React.FC = () => {
  const [values, setValues] = useState({
    fob_value: '',
    freight: '',
    insurance: '',
    exchange_rate: '950'
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
      // Enviamos los datos mapeados correctamente al servicio
      const response = await financeService.calculate({
        name: `Cálculo ${new Date().toLocaleDateString()}`,
        fob_value: Number(values.fob_value),
        freight: Number(values.freight),
        insurance: Number(values.insurance),
        exchange_rate: Number(values.exchange_rate)
      });
      setResult(response);
    } catch (error) {
      console.error("Error calculando", error);
      alert("Error al realizar el cálculo. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const formatCLP = (amount: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  const formatUSD = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="finance-container">
      <div className="finance-header">
        <h1 className="finance-title">Calculadora de Importación</h1>
        <p style={{ color: '#aaa' }}>Estima tus costos totales según la normativa chilena.</p>
      </div>

      <div className="calculator-layout">
        <div className="form-card">
          <form onSubmit={handleCalculate}>
            <div className="input-group">
              <label className="input-label">Valor FOB (Mercancía USD)</label>
              <input type="number" name="fob_value" className="currency-input" value={values.fob_value} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Flete Internacional (USD)</label>
              <input type="number" name="freight" className="currency-input" value={values.freight} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Seguro (USD)</label>
              <input type="number" name="insurance" className="currency-input" value={values.insurance} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Tipo de Cambio (CLP)</label>
              <input type="number" name="exchange_rate" className="currency-input" value={values.exchange_rate} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-calculate" disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular Costos'}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-card">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Desglose Oficial</h3>
            <div className="result-row">
              <span>CIF (USD)</span>
              <span style={{ color: '#4A6CFF' }}>{formatUSD(result.cif_usd)}</span>
            </div>
            <div className="result-row">
              <span>CIF (CLP)</span>
              <span>{formatCLP(result.cif_clp)}</span>
            </div>
            <hr style={{ borderColor: '#333', margin: '10px 0' }} />
            <div className="result-row">
              <span>Ad Valorem (6%)</span>
              <span style={{ color: '#ff4444' }}>+ {formatCLP(result.ad_valorem)}</span>
            </div>
            <div className="result-row">
              <span>IVA (19%)</span>
              <span style={{ color: '#ff4444' }}>+ {formatCLP(result.iva)}</span>
            </div>
            <div className="total-row">
              <span>Costo Total</span>
              <span className="total-value">{formatCLP(result.total_cost)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportCalculatorPage;