import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useResource } from "../../hooks/useResource.js";
import {
  BackLink,
  Badge,
  ConfirmDialog,
  PageHeading,
  ResourceState,
} from "../../components/ui.jsx";
import { roleLabel } from "../../utils/formatters.js";

export function UserDetail({ profile = false }) {
  const params = useParams();
  const { user, repository, refresh } = useApp();
  const id = profile ? user.id : params.id;
  const resource = useResource("getUser", id);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await repository.deleteUser(id);
      await refresh("Usuario eliminado.");
      navigate("/usuarios");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {!profile && <BackLink to="/usuarios" />}
      <ResourceState resource={resource}>
        {(target) => (
          <>
            <PageHeading
              eyebrow="MÓDULO DE USUARIOS"
              title={profile ? "Mi perfil" : "Detalle del usuario"}
              description="Información de la cuenta y perfil de acceso."
            />
            <section className="panel profile-panel">
              <div className="profile-heading">
                <div className="avatar large">
                  {target.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2>{target.name}</h2>
                  <p className="muted">{target.email}</p>
                </div>
                <Badge>{roleLabel(target.role)}</Badge>
              </div>
              <dl className="profile-data">
                <div>
                  <dt>Identificador</dt>
                  <dd className="identifier">{target.id}</dd>
                </div>
                <div>
                  <dt>Nombre completo</dt>
                  <dd>{target.name}</dd>
                </div>
                <div>
                  <dt>Correo electrónico</dt>
                  <dd>{target.email}</dd>
                </div>
                <div>
                  <dt>Estado de la cuenta</dt>
                  <dd>
                    <Badge>{target.active ? "Activo" : "Inactivo"}</Badge>
                  </dd>
                </div>
              </dl>
              <div className="form-actions">
                <Link
                  className="button primary"
                  to={profile ? "/perfil/editar" : `/usuarios/${id}/editar`}
                >
                  <Pencil size={17} />
                  Editar usuario
                </Link>
                {user.role === "admin" && user.id !== id && (
                  <button
                    className="button danger-outline"
                    onClick={() => {
                      setError("");
                      setOpen(true);
                    }}
                  >
                    <Trash2 size={17} />
                    Eliminar usuario
                  </button>
                )}
              </div>
            </section>
            <ConfirmDialog
              open={open}
              title="¿Eliminar este usuario?"
              description={`Se eliminará la cuenta de ${target.name}. Solo es posible si no tiene solicitudes asociadas. Esta acción no se puede deshacer.`}
              onClose={() => setOpen(false)}
              onConfirm={remove}
              busy={busy}
              error={error}
            />
          </>
        )}
      </ResourceState>
    </>
  );
}
