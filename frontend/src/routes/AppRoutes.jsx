import { Navigate, Route, Routes } from "react-router-dom";
import Protected from "./ProtectedRoute.jsx";
import Layout from "../views/layouts/MainLayout.jsx";
import Auth from "../views/auth/Auth.jsx";
import Dashboard from "../views/dashboard/Dashboard.jsx";
import { BackLink } from "../views/common/ui.jsx";
import { TicketList } from "../views/tickets/TicketList.jsx";
import { TicketDetail } from "../views/tickets/TicketDetail.jsx";
import { TicketEditor } from "../views/tickets/TicketEditor.jsx";
import { UserList } from "../views/users/UserList.jsx";
import { UserDetail } from "../views/users/UserDetail.jsx";
import { UserEditor } from "../views/users/UserEditor.jsx";

// El mapa de rutas concentra la navegación de los dos perfiles.
export default function AppRoutes() {
  return (
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
  );
}
