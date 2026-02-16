import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch {
        console.log("No autenticado");
      }
    }

    loadProfile();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {profile ? (
        <div>
          <p>Email: {profile.email}</p>
          <p>Nivel: {profile.level}</p>
          <p>Puntos: {profile.points}</p>
        </div>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}