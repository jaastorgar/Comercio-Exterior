import React, { useEffect, useState } from 'react';
import { authService, UserProfile } from '../service/auth.service';
import client from '../../../api/client';
import '../styles/Profile.css';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bio, setBio] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setBio(data.bio || '');
    } catch (error) {
      console.error("Error cargando perfil", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Usamos FormData para enviar texto + archivo
      const formData = new FormData();
      formData.append('bio', bio);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      // Hacemos el PATCH directo con axios client para soportar FormData
      await client.patch('/accounts/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('¡Perfil actualizado con éxito! ✅');
      loadProfile(); // Recargar datos para ver cambios
    } catch (error) {
      console.error(error);
      setMessage('Error al actualizar perfil ❌');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div style={{padding: '2rem', color:'white'}}>Cargando perfil...</div>;

  return (
    <div style={{minHeight: '100vh', padding: '2rem', background: 'black'}}>
      <h1 style={{color: 'white', textAlign: 'center', marginBottom: '2rem'}}>Mi Perfil Profesional</h1>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-container">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
            ) : (
              <span className="profile-avatar-placeholder">
                {profile.first_name ? profile.first_name[0] : 'U'}
              </span>
            )}
          </div>
        </div>

        <div className="profile-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 className="profile-name">{profile.first_name} {profile.last_name}</h2>
              <p className="profile-email">{profile.email}</p>
            </div>
            {/* Input para cambiar avatar */}
            <div>
               <label style={{color: '#aaa', fontSize: '0.8rem', display: 'block'}}>Cambiar Foto:</label>
               <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{profile.level}</span>
              <span className="stat-label">Nivel</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.points} XP</span>
              <span className="stat-label">Puntos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">#{profile.ranking_score || '-'}</span>
              <span className="stat-label">Ranking</span>
            </div>
          </div>

          <div className="form-group">
            <label>Sobre mí (Biografía)</label>
            <textarea 
              className="form-control" 
              rows={4} 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escribe algo sobre tus objetivos profesionales..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            {message && <span style={{ color: message.includes('Error') ? 'red' : '#00C851' }}>{message}</span>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;