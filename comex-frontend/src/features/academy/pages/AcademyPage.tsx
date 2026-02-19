import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, Course } from '../../accounts/service/auth.service';
import '../styles/Academy.css';

const AcademyPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]); // Array de UserProgress
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecutamos ambas peticiones en paralelo para ser más rápidos
        const [coursesData, progressData] = await Promise.all([
          authService.getCourses(),
          authService.getProgress()
        ]);
        setCourses(coursesData);
        setUserProgress(progressData);
      } catch (error) {
        console.error("Error cargando academia", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Función auxiliar para calcular porcentaje (lógica simple visual)
  const getProgressPercentage = (courseId: number) => {
    // Aquí podrías implementar lógica más compleja si tuvieras el total de lecciones por curso en el frontend.
    // Por ahora, simularemos que si hay progreso, mostramos avance visual.
    const progressEntries = userProgress.filter(p => p.course_id === courseId); // Nota: requeriría ajustar el serializador para incluir course_id en progress, o asumir lógica.
    // Simplificación para MVP: Si tiene al menos una lección hecha, 10% de avance visual por lección
    return Math.min(progressEntries.length * 10, 100);
  };

  return (
    <div className="academy-container">
      <div className="academy-header">
        <h1 className="academy-title">Mi Academia 🎓</h1>
        <p style={{ color: '#aaa' }}>Selecciona un módulo para continuar tu aprendizaje.</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando cursos...</p>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div>
                <h3 className="course-title">{course.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>{course.description}</p>
                
                {/* Barra de Progreso Visual */}
                <div className="course-progress-container">
                  <div 
                    className="course-progress-bar" 
                    style={{ width: `${getProgressPercentage(course.id)}%` }}
                  ></div>
                </div>
                <small style={{ color: '#666' }}>Nivel {course.id}</small>
              </div>

              {/* Botón que lleva al reproductor de lecciones */}
              <Link to={`/academy/play/${course.id}`} className="btn-start">
                Entrar al Curso
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademyPage;