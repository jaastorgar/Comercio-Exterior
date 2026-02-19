import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService, Lesson } from '../../accounts/service/auth.service';
import '../styles/Academy.css';

const LessonPlayerPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // 1. Cargar las lecciones de este curso
  useEffect(() => {
    const loadLessons = async () => {
      if (!courseId) return;
      try {
        const data = await authService.getLessons(Number(courseId));
        // Las ordenamos por el campo 'order' para asegurar la secuencia
        const sorted = data.sort((a, b) => a.order - b.order);
        setLessons(sorted);
      } catch (error) {
        console.error("Error cargando lecciones", error);
      } finally {
        setLoading(false);
      }
    };
    loadLessons();
  }, [courseId]);

  const currentLesson = lessons[currentIndex];

  // 2. Manejar cuando el usuario completa la lección
  const handleCompleteLesson = async () => {
    if (!currentLesson) return;

    try {
      // Guardar en Backend (Ganar XP)
      await authService.saveProgress({
        lesson: currentLesson.id,
        score: 10, // 10 puntos por lección
        completed: true
      });

      // Avanzar a la siguiente
      if (currentIndex < lessons.length - 1) {
        setCurrentIndex(currentIndex + 1);
        window.scrollTo(0, 0); // Subir scroll
      } else {
        setCompleted(true); // Curso terminado
      }
    } catch (error) {
      alert("Error al guardar progreso. Revisa tu conexión.");
    }
  };

  if (loading) return <div className="academy-container">Cargando clase...</div>;
  
  if (lessons.length === 0) return (
    <div className="academy-container" style={{textAlign: 'center'}}>
      <h2>Este curso aún no tiene lecciones.</h2>
      <button className="btn-back" onClick={() => navigate('/academy')}>Volver</button>
    </div>
  );

  if (completed) return (
    <div className="academy-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 ¡Felicidades! 🎉</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
        Has completado todas las lecciones de este módulo.
      </p>
      <button className="btn-start" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => navigate('/academy')}>
        Volver al Menú
      </button>
    </div>
  );

  return (
    <div className="academy-container">
      <div className="lesson-player-layout">
        <header style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <small style={{ color: '#F57C00', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Lección {currentIndex + 1} de {lessons.length}
          </small>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{currentLesson.title}</h2>
        </header>

        {/* CONTENIDO DE LA LECCIÓN */}
        <div className="lesson-content">
          {/* Aquí podrías usar un parser de Markdown si el contenido viene así */}
          {currentLesson.content}
        </div>

        <div className="lesson-footer">
          <button className="btn-back" onClick={() => navigate('/academy')}>
            Salir
          </button>
          
          <button className="btn-complete" onClick={handleCompleteLesson}>
            {currentIndex === lessons.length - 1 ? 'Finalizar Curso 🏆' : 'Siguiente Lección →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayerPage;