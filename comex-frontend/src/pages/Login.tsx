import "./Login.css";

export default function Login() {
  return (
    <section className="login">
      <h1>Iniciar sesión</h1>

      <form>
        <label>
          Correo electrónico
          <input type="email" />
        </label>

        <label>
          Contraseña
          <input type="password" />
        </label>

        <button type="submit">Ingresar</button>
      </form>
    </section>
  );
}