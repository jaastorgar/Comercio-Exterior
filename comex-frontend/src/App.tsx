import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Login from "./pages/Login";
import Cubicaje from "./pages/Cubicaje";

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: 16, background: "#e5e7eb" }}>
        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/">Inicio</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/login">Login</Link>
          <Link to="/cubicaje">Cubicaje 3D</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cubicaje" element={<Cubicaje />} />
      </Routes>
    </BrowserRouter>
  );
}