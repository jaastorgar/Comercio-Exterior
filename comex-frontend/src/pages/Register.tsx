import { useState } from "react";
import { register } from "../api/auth";

interface RegisterProps {
  onRegistered: () => void;
  onLoginClick: () => void; // Propiedad añadida para solucionar ts(2322)
}

export default function Register({ onRegistered, onLoginClick }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      alert("Usuario creado correctamente");
      onRegistered();
    } catch (error: any) {
      console.error(error);
      alert("Error en el registro");
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      <button onClick={onLoginClick} className="switch-auth-btn">
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </div>
  );
}