import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Layout from "./components/Layout.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { TicketList, TicketDetail, TicketEditor } from "./pages/Tickets.jsx";
import { UserList, UserDetail, UserEditor } from "./pages/Users.jsx";
import { BackLink, ErrorMessage } from "./components/ui.jsx";
import "./styles.css";

function Protected({ admin = false }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/ingresar" replace />;
  if (admin && user.role !== "admin")
    return (
      <div className="panel">
        <ErrorMessage message="Esta sección está disponible para administradores." />
        <BackLink to="/inicio">Volver al inicio</BackLink>
      </div>
    );
  return <Outlet />;
}
function App() {
  const { loading, fatalError, notice, user } = useApp();
  if (loading)
    return (
      <div className="boot" role="status">
        Preparando Campus Soporte…
      </div>
    );
  if (fatalError)
    return (
      <div className="boot">
        <ErrorMessage message={fatalError} />
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  return (
    <>
      {!user && notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      <Routes>
        <Route path="/ingresar" element={<Auth key="login" />} />
        <Route path="/registro" element={<Auth key="register" register />} />
        <Route element={<Protected />}>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Dashboard />} />
            <Route path="/solicitudes" element={<TicketList />} />
            <Route path="/solicitudes/nueva" element={<TicketEditor />} />
            <Route path="/solicitudes/:id" element={<TicketDetail />} />
            <Route path="/solicitudes/:id/editar" element={<TicketEditor />} />
            <Route path="/perfil" element={<UserDetail profile />} />
            <Route path="/perfil/editar" element={<UserEditor profile />} />
            <Route element={<Protected admin />}>
              <Route path="/usuarios" element={<UserList />} />
              <Route path="/usuarios/nuevo" element={<UserEditor />} />
              <Route path="/usuarios/:id" element={<UserDetail />} />
              <Route path="/usuarios/:id/editar" element={<UserEditor />} />
            </Route>
            <Route
              path="*"
              element={
                <div className="panel">
                  <h1>Página no encontrada</h1>
                  <BackLink to="/inicio">Volver al inicio</BackLink>
                </div>
              }
            />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
);
