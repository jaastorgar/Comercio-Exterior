import React, { useEffect, useState } from 'react';
import { regulatoryService } from '../services/regulatory.service';
import { Regulation, RegulatoryBody, ProductCategory } from '../types/regulatory.types';
import '../styles/Regulatory.css';

const RegulatoryPage: React.FC = () => {
  // Datos principales
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  
  // Datos para los filtros
  const [bodies, setBodies] = useState<RegulatoryBody[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  // Estado de los filtros seleccionados
  const [selectedBody, setSelectedBody] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 1. Cargar opciones de filtros al iniciar
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [bodiesData, catsData] = await Promise.all([
          regulatoryService.getBodies(),
          regulatoryService.getCategories()
        ]);
        setBodies(bodiesData);
        setCategories(catsData);
      } catch (error) {
        console.error("Error cargando filtros", error);
      }
    };
    loadFilters();
  }, []);

  // 2. Cargar regulaciones cuando cambian los filtros
  useEffect(() => {
    const fetchRegulations = async () => {
      setLoading(true);
      try {
        const bodyId = selectedBody ? Number(selectedBody) : undefined;
        const catId = selectedCategory ? Number(selectedCategory) : undefined;
        
        const data = await regulatoryService.getRegulations(bodyId, catId);
        setRegulations(data);
      } catch (error) {
        console.error("Error buscando normativa", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegulations();
  }, [selectedBody, selectedCategory]);

  return (
    <div className="regulatory-container">
      
      <div className="regulatory-header">
        <h1>Biblioteca Normativa ⚖️</h1>
        <p style={{ color: '#aaa' }}>Encuentra regulaciones técnicas por organismo o tipo de producto.</p>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="search-filters-bar">
        <div className="filter-group">
          <label className="filter-label">Organismo Regulador</label>
          <select 
            className="filter-select"
            value={selectedBody}
            onChange={(e) => setSelectedBody(e.target.value)}
          >
            <option value="">Todos los organismos</option>
            {bodies.map(body => (
              <option key={body.id} value={body.id}>
                {body.name} ({body.country})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Categoría de Producto</label>
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RESULTADOS */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Buscando normas...</p>
      ) : (
        <div className="regulations-grid">
          {regulations.length > 0 ? (
            regulations.map(reg => (
              <div key={reg.id} className="regulation-card">
                <div>
                  <span className={`reg-badge ${reg.is_international ? 'badge-intl' : 'badge-local'}`}>
                    {reg.is_international ? 'INTERNACIONAL' : 'NACIONAL'}
                  </span>
                  
                  <h3 className="reg-title">{reg.title}</h3>
                  
                  <div className="reg-body">
                    🏛️ {reg.body.name}
                  </div>
                  
                  <p className="reg-desc">{reg.description}</p>
                </div>

                <div className="reg-categories">
                  {reg.categories.map(cat => (
                    <span key={cat.id} className="cat-tag">#{cat.name}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              No se encontraron regulaciones con estos filtros.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegulatoryPage;