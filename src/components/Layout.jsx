import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Ticket,
  Users,
  UserRound,
  LogOut,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../hooks/useApp.js";
import { roleLabel } from "../utils/formatters.js";

import { Brand } from "./Brand.jsx";

export default function Layout() {
  const { user, repository, refresh, notice } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const section = pathname.startsWith("/usuarios")
    ? "Usuarios"
    : pathname.startsWith("/solicitudes")
      ? "Solicitudes"
      : pathname.startsWith("/perfil")
        ? "Mi perfil"
        : "Vista general";
  async function logout() {
    await repository.logout();
    await refresh();
    navigate("/ingresar");
  }
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#contenido"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("contenido")?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">
          <span className="online-dot" /> Mesa de ayuda universitaria
        </div>
        <p className="nav-label">ESPACIO DE TRABAJO</p>
        <nav aria-label="Navegación principal">
          <NavLink to="/inicio">
            <LayoutDashboard size={19} />
            Vista general
          </NavLink>
          <NavLink to="/solicitudes">
            <Ticket size={19} />
            {user.role === "admin" ? "Solicitudes" : "Mis solicitudes"}
          </NavLink>
          {user.role === "admin" && (
            <NavLink to="/usuarios">
              <Users size={19} />
              Usuarios
            </NavLink>
          )}
          <NavLink to="/perfil">
            <UserRound size={19} />
            Mi perfil
          </NavLink>
        </nav>
        <div className="sidebar-note">
          <span className="note-icon">
            <GraduationCap size={23} />
          </span>
          <strong>Un campus conectado</strong>
          <p>Un solo lugar para encontrar ayuda y seguir tus solicitudes.</p>
          <NavLink to="/solicitudes/nueva">
            Crear una solicitud <ArrowUpRight size={16} />
          </NavLink>
        </div>
        <div className="sidebar-user">
          <div className="avatar">
            {user.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <strong>{user.name}</strong>
            <small>{roleLabel(user.role)}</small>
          </div>
          <button
            className="icon-button"
            onClick={logout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={19} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>
            Mi campus <span className="breadcrumb-slash">/</span>
            <strong>{section}</strong>
          </span>
          <span className="demo-label">
            <span className="online-dot" /> Demo académica · Corte 1
          </span>
        </header>
        <main id="contenido" tabIndex="-1">
          <Outlet />
        </main>
        <footer>
          Campus Soporte <span>Ingeniería Web II · Primer corte</span>
        </footer>
      </div>
      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={20} />
          {notice}
        </div>
      )}
    </div>
  );
}
