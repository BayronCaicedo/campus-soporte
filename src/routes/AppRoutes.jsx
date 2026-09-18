import { Navigate, Route, Routes } from "react-router-dom";
import Protected from "./ProtectedRoute.jsx";
import Layout from "../components/Layout.jsx";
import Auth from "../pages/Auth.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import { BackLink } from "../components/ui.jsx";
import { TicketList } from "../pages/tickets/TicketList.jsx";
import { TicketDetail } from "../pages/tickets/TicketDetail.jsx";
import { TicketEditor } from "../pages/tickets/TicketEditor.jsx";
import { UserList } from "../pages/users/UserList.jsx";
import { UserDetail } from "../pages/users/UserDetail.jsx";
import { UserEditor } from "../pages/users/UserEditor.jsx";

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
