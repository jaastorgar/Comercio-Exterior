import React, { useEffect, useState } from 'react';
import { authService } from '../../accounts/service/auth.service';

interface UserProfile {
    email: string;
    first_name: string;
    last_name: string;
    points: number;
    level: number;
}

const UserProfileWidget: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authService.getProfile();
        // @ts-ignore
        setProfile(data);
      } catch (error) {
        console.error("Error cargando perfil", error);
      }
    };
    loadProfile();
  }, []);

  if (!profile) return <div style={{ color: '#666' }}>Cargando usuario...</div>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #FFD700, #F57C00)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: 'black'
      }}>
        {profile.first_name ? profile.first_name[0].toUpperCase() : 'U'}
      </div>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>
            Hola, {profile.first_name || 'Estudiante'}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#4A6CFF' }}>
            Nivel {profile.level || 1} • {profile.points || 0} XP
        </div>
      </div>
    </div>
  );
};

export default UserProfileWidget;