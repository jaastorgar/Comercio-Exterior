import React, { useEffect, useState } from 'react';
import { networkingService } from '../services/networking.service';
import { Post, StudentProfile } from '../types/networking.types';
import '../styles/Networking.css';

const SocialFeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  
  // Cargar datos al inicio
  useEffect(() => {
    loadFeed();
    loadStudents();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await networkingService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error cargando posts", error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await networkingService.getAllStudents();
      setStudents(data.slice(0, 5)); // Mostrar solo los primeros 5 en el sidebar
    } catch (error) {
      console.error("Error cargando estudiantes", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      await networkingService.createPost(newPostContent);
      setNewPostContent('');
      loadFeed(); // Recargar el muro
    } catch (error) {
      alert("Error al publicar.");
    }
  };

  const handleConnect = async (userId: number) => {
    try {
      await networkingService.sendConnectionRequest(userId);
      alert("Solicitud enviada 🤝");
    } catch (error) {
      alert("Error al enviar solicitud.");
    }
  };

  return (
    <div className="networking-container">
      
      {/* SECCIÓN CENTRAL: MURO */}
      <div className="feed-section">
        <h1 style={{ marginBottom: '1.5rem' }}>Comunidad Comex</h1>

        {/* Crear Post */}
        <div className="create-post-card">
          <textarea
            className="post-input"
            rows={3}
            placeholder="¿Qué estás aprendiendo hoy?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button className="btn-primary" onClick={handleCreatePost}>
            Publicar
          </button>
        </div>

        {/* Lista de Posts */}
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div>
                <div className="author-name">{post.author_name}</div>
                <div className="author-institution">{post.author_institution}</div>
              </div>
              <small style={{ color: '#666' }}>{new Date(post.created_at).toLocaleDateString()}</small>
            </div>
            
            <p className="post-content">{post.content}</p>
            
            <div className="comments-section">
              <small style={{ color: '#aaa' }}>{post.comments_count} Comentarios</small>
              {/* Aquí podrías mapear los comentarios si deseas mostrarlos expandidos */}
            </div>
          </div>
        ))}
      </div>

      {/* BARRA LATERAL: SUGERENCIAS DE CONEXIÓN */}
      <div className="students-sidebar">
        <h3>Estudiantes Sugeridos</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Conecta con compañeros de otras instituciones.
        </p>
        
        {students.map(student => (
          <div key={student.id} className="student-card-mini">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{student.full_name}</div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>{student.institution}</div>
            </div>
            {/* Usamos el ID del perfil para obtener el ID del usuario si es necesario, 
                pero el backend espera user_id. Asumiendo que StudentProfile tiene id diferente a user.
                NOTA: En tu backend, sendConnectionRequest espera 'to_user'. 
                Asegúrate de que 'student.id' sea el ID correcto o ajusta el tipo. 
            */}
            <button className="btn-connect" onClick={() => handleConnect(student.id)}>
              + Conectar
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SocialFeedPage;