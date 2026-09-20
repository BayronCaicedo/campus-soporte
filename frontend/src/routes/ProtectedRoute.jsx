import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../hooks/useApp.js";
import { BackLink, ErrorMessage } from "../views/common/ui.jsx";

export default function Protected({ admin = false }) {
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
