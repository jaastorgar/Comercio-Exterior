import React, { useEffect, useState } from 'react';
import { networkingService } from '../services/networking.service';
import { StudentProfile } from '../types/networking.types';
import '../styles/Networking.css';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar estudiantes (con o sin búsqueda)
  const loadStudents = async (query = '') => {
    setLoading(true);
    try {
      const data = await networkingService.getAllStudents(query);
      setStudents(data);
    } catch (error) {
      console.error("Error buscando estudiantes", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    loadStudents();
  }, []);

  // Manejar búsqueda al presionar Enter o botón
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudents(searchTerm);
  };

  const handleConnect = async (student: StudentProfile) => {
    // Asumimos que student.user es el ID del usuario (número)
    // Si tu tipo StudentProfile no tiene 'user', agrégalo en networking.types.ts: user: number;
    try {
      // @ts-ignore: Si TypeScript reclama por el campo user, ignóralo por ahora o actualiza el type
      await networkingService.sendConnectionRequest(student.user);
      alert(`Solicitud enviada a ${student.full_name}`);
    } catch (error) {
      alert("Error al conectar. Quizás ya tienes una solicitud pendiente.");
    }
  };

  // Generar iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="networking-container" style={{ display: 'block' }}> {/* Override para que ocupe todo el ancho */}
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Directorio de Estudiantes</h1>
        <p style={{ color: '#aaa' }}>Encuentra compañeros de tu misma carrera o institución y expande tu red.</p>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="students-search-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            className="search-input"
            placeholder="Buscar por nombre, universidad o carrera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
            Buscar
          </button>
        </form>
      </div>

      {/* GRID DE RESULTADOS */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando directorio...</p>
      ) : (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.id} className="student-card-full">
              <div className="student-avatar-placeholder">
                {getInitials(student.full_name)}
              </div>
              
              <h3 className="student-name">{student.full_name}</h3>
              
              <div className="student-meta" style={{ color: '#F57C00' }}>
                {student.institution}
              </div>
              
              <div className="student-meta">
                {student.career} • {student.study_level}°
              </div>

              <div className="student-tags">
                <span className="tag-badge">{student.area_interest || 'Comex'}</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "{student.bio || 'Estudiante de Comercio Exterior listo para aprender.'}"
              </p>

              <button 
                className="btn-connect-full"
                onClick={() => handleConnect(student)}
              >
                Conectar
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && students.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666' }}>
          No se encontraron estudiantes con esos criterios.
        </div>
      )}
    </div>
  );
};

export default StudentsPage;