import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { networkingService } from '../services/networking.service'; 
import { Post, StudentProfile } from '../types/networking.types';
import '../styles/Networking.css';

const SocialFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    loadFeed();
    loadStudents();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await networkingService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error al cargar el muro", error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await networkingService.getAllStudents();
      setStudents(data.slice(0, 5));
    } catch (error) {
      console.error("Error al cargar estudiantes", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      await networkingService.createPost(newPostContent);
      setNewPostContent('');
      loadFeed();
    } catch (error) {
      alert("No se pudo publicar.");
    }
  };

  return (
    <div className="networking-container">
      <div className="feed-section">
        <h1>Comunidad Comex</h1>
        <div className="create-post-card">
          <textarea 
            className="post-input" 
            placeholder="Comparte un tip o noticia sobre Comex..." 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button className="btn-primary" onClick={handleCreatePost}>Publicar</button>
        </div>

        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="author-name">{post.author_name}</span>
                <span className="author-institution">• {post.author_institution}</span>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <small>{post.comments_count} comentarios</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="students-sidebar">
        <h3>Compañeros</h3>
        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>Sugerencias para conectar</p>
        
        <div className="sidebar-list">
          {students.map(s => (
            <div key={s.id} className="sidebar-student-item">
              <div className="sidebar-info">
                <div className="sidebar-name">{s.full_name}</div>
                <div className="sidebar-meta">{s.institution}</div>
              </div>
              <button 
                className="btn-sidebar-chat" 
                onClick={() => navigate(`/networking/chat/${s.user}`)}
                title="Chatear ahora"
              >
                💬
              </button>
            </div>
          ))}
        </div>

        <button 
          className="btn-view-all" 
          onClick={() => navigate('/networking/students')}
        >
          Ver Directorio Completo
        </button>
      </div>
    </div>
  );
};

export default SocialFeedPage;