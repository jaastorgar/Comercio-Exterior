import { useState } from "react";
import { register } from "../api/auth";

interface RegisterProps {
  onRegistered: () => void;
}

export default function Register({ onRegistered }: RegisterProps) {
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
    <div>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}