// src/features/networking/pages/StudentsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { networkingService } from '../services/networking.service';
import { StudentProfile } from '../types/networking.types';
import '../styles/Networking.css';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await networkingService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleConnect = async (userId: number) => {
    try {
      await networkingService.sendConnectionRequest(userId);
      alert("Solicitud enviada");
      loadStudents();
    } catch (error) {
      alert("Ya existe una solicitud pendiente.");
    }
  };

  return (
    <div className="networking-container" style={{ display: 'block' }}>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Directorio de Estudiantes</h1>
      <div className="students-grid">
        {students.map(student => (
          <div key={student.id} className="student-card-full">
            <h3 className="student-name">{student.full_name}</h3>
            <p className="student-meta">{student.institution}</p>
            
            <div className="action-buttons-grid">
              {/* Lógica de botones según status */}
              {student.connection_status === 'accepted' ? (
                <button 
                  className="btn-chat-secondary"
                  onClick={() => navigate(`/networking/chat/${student.user}`)}
                >
                  Chatear
                </button>
              ) : student.connection_status === 'pending' ? (
                <button className="btn-disabled" disabled>Pendiente</button>
              ) : (
                <button 
                  className="btn-connect-full"
                  onClick={() => handleConnect(student.user)}
                >
                  Conectar con {student.full_name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsPage;