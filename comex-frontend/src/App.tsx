import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { getProfile } from "./api/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [view, setView] = useState<"login" | "register">("login");

  useEffect(() => {
    async function checkAuth() {
      try {
        await getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div>
      {view === "login" ? (
        <>
          <Login onSuccess={() => setIsAuthenticated(true)} />
          <p>
            ¿No tienes cuenta?{" "}
            <button onClick={() => setView("register")}>
              Registrarse
            </button>
          </p>
        </>
      ) : (
        <>
          <Register onRegistered={() => setView("login")} />
          <p>
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => setView("login")}>
              Iniciar sesión
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;