import React, { useEffect, useMemo, useState } from "react";
import { Calculator, DollarSign, Info, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { createImportSimulation, listImportSimulations, ImportSimulation } from "../api/finance";
import "../styles/CostCalculator.css";

const CostCalculator: React.FC = () => {
  // Inputs (USD)
  const [fob, setFob] = useState<number>(15000);
  const [freight, setFreight] = useState<number>(2450);
  const [insuranceRate, setInsuranceRate] = useState<number>(0.02); // 2%
  const [adValorem, setAdValorem] = useState<number>(0.06); // 6%
  const [exchangeRate, setExchangeRate] = useState<number>(950); // CLP por USD (editable)

  // Backend state
  const [saving, setSaving] = useState(false);
  const [backendResult, setBackendResult] = useState<ImportSimulation | null>(null);
  const [history, setHistory] = useState<ImportSimulation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cálculo local (USD) - mantiene tu idea original
  const calculated = useMemo(() => {
    const insuranceUsd = fob * insuranceRate;
    const cifUsd = fob + freight + insuranceUsd;
    const dutyUsd = cifUsd * adValorem;
    const ivaUsd = (cifUsd + dutyUsd) * 0.19;
    const totalUsd = cifUsd + dutyUsd + ivaUsd;

    return { insuranceUsd, cifUsd, dutyUsd, ivaUsd, totalUsd };
  }, [fob, freight, insuranceRate, adValorem]);

  const formatUSD = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "USD" }).format(val);

  const formatCLP = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

  const parseNumber = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  async function refreshHistory() {
    try {
      const data = await listImportSimulations();
      setHistory(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch {
      // Si no está logueado o backend caído, no bloqueamos la UI
    }
  }

  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSimulation = async () => {
    setSaving(true);
    setErrorMsg(null);
    setBackendResult(null);

    try {
      const payload = {
        fob_value: fob,
        freight,
        insurance: calculated.insuranceUsd,
        exchange_rate: exchangeRate,
      };

      const created = await createImportSimulation(payload);
      setBackendResult(created);
      await refreshHistory();
    } catch (err: any) {
      // Tu client.ts lanza Error("Error en la petición") sin detalle;
      // así que mostramos mensaje genérico + hint de auth.
      const token = localStorage.getItem("access_token");
      if (!token) {
        setErrorMsg("No hay sesión activa. Inicia sesión para guardar simulaciones.");
      } else {
        setErrorMsg("No se pudo guardar la simulación. Revisa que el backend esté arriba y la ruta sea correcta.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cc-container">
      <div className="cc-card">
        <div className="cc-header">
          <div className="cc-title">
            <Calculator className="cc-icon" size={28} />
            <h2>Calculadora de Costeo de Importación</h2>
          </div>
          <p className="cc-subtitle">
            Calcula CIF, arancel e IVA. Además puedes guardar la simulación en el backend (CLP) para verificar conexión.
          </p>
        </div>

        <div className="cc-grid">
          {/* Inputs */}
          <section className="cc-section">
            <h3 className="cc-section-title">Datos de origen (USD)</h3>

            <InputField
              label="Valor FOB (mercadería)"
              value={fob}
              onChange={setFob}
              icon={<DollarSign size={16} />}
            />

            <InputField
              label="Flete internacional"
              value={freight}
              onChange={setFreight}
              icon={<Truck size={16} />}
            />

            <InputField
              label="Tasa de seguro (%)"
              value={insuranceRate * 100}
              onChange={(v) => setInsuranceRate(v / 100)}
              icon={<ShieldCheck size={16} />}
            />

            <InputField
              label="Tipo de cambio (CLP por USD)"
              value={exchangeRate}
              onChange={setExchangeRate}
              icon={<ArrowRight size={16} />}
            />

            <div className="cc-select">
              <label>Arancel Ad-Valorem (Chile)</label>
              <select value={adValorem} onChange={(e) => setAdValorem(parseNumber(e.target.value))}>
                <option value={0.06}>Estándar (6%)</option>
                <option value={0}>TLC Acuerdo (0%)</option>
                <option value={0.02}>Parcial (2%)</option>
              </select>
              <small>Nota: el backend actualmente calcula ad-valorem fijo 6%. (Si quieres, lo alineamos después.)</small>
            </div>

            <button className="cc-button" onClick={handleSaveSimulation} disabled={saving}>
              {saving ? "Guardando..." : "Guardar simulación (backend)"}
            </button>

            {errorMsg && <div className="cc-error">{errorMsg}</div>}
          </section>

          {/* Results */}
          <section className="cc-section cc-results">
            <h3 className="cc-section-title">
              Resumen (cálculo local) <Info size={16} />
            </h3>

            <div className="cc-rows">
              <ResultRow label="FOB Base" value={formatUSD(fob)} />
              <ResultRow label="Seguro (prima)" value={formatUSD(calculated.insuranceUsd)} />
              <div className="cc-divider" />
              <ResultRow label="VALOR CIF" value={formatUSD(calculated.cifUsd)} highlight />
              <ResultRow label="Derecho Ad-Valorem" value={formatUSD(calculated.dutyUsd)} />
              <ResultRow label="IVA importación (19%)" value={formatUSD(calculated.ivaUsd)} />
            </div>

            <div className="cc-total">
              <span>Costo Total (USD)</span>
              <strong>{formatUSD(calculated.totalUsd)}</strong>
            </div>

            {/* Backend result (CLP) */}
            <div className="cc-backend">
              <h4>Resultado backend (CLP)</h4>

              {!backendResult ? (
                <p className="cc-muted">Aún no hay simulación guardada en backend en esta sesión.</p>
              ) : (
                <div className="cc-rows">
                  <ResultRow label="CIF (CLP)" value={formatCLP(Number(backendResult.cif))} />
                  <ResultRow label="Ad-Valorem (CLP)" value={formatCLP(Number(backendResult.ad_valorem))} />
                  <ResultRow label="IVA (CLP)" value={formatCLP(Number(backendResult.iva))} />
                  <div className="cc-divider" />
                  <ResultRow
                    label="Total desaduanado (CLP)"
                    value={formatCLP(Number(backendResult.total_cost))}
                    highlight
                  />
                </div>
              )}
            </div>

            {/* History */}
            <div className="cc-history">
              <h4>Últimas simulaciones</h4>
              {history.length === 0 ? (
                <p className="cc-muted">Sin historial (o no hay sesión).</p>
              ) : (
                <ul>
                  {history.map((h) => (
                    <li key={h.id}>
                      <span className="cc-history-date">{new Date(h.created_at).toLocaleString("es-CL")}</span>
                      <span className="cc-history-val">{formatCLP(Number(h.total_cost))}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
}> = ({ label, value, onChange, icon }) => (
  <div className="cc-input">
    <label>{label}</label>
    <div className="cc-input-wrap">
      <div className="cc-input-icon">{icon}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step="any"
      />
    </div>
  </div>
);

const ResultRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <div className={`cc-row ${highlight ? "cc-row-highlight" : ""}`}>
    <span>{label}</span>
    <span className="cc-row-value">{value}</span>
  </div>
);

export default CostCalculator;