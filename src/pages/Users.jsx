import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useResource } from "../hooks/useResource.js";
import {
  BackLink,
  Badge,
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  Field,
  PageHeading,
  ResourceState,
  roleLabel,
} from "../components/ui.jsx";

export function UserList() {
  const resource = useResource("listUsers");
  const [query, setQuery] = useState("");
  return (
    <>
      <PageHeading
        eyebrow="MÓDULO DE USUARIOS"
        title="Nuestra comunidad"
        description="Administra las cuentas y los perfiles de acceso al campus."
      >
        <Link className="button primary" to="/usuarios/nuevo">
          <Plus size={18} />
          Registrar usuario
        </Link>
      </PageHeading>
      <section className="panel table-panel">
        <div className="filters">
          <div className="search-field">
            <Search size={18} />
            <input
              aria-label="Buscar usuarios"
              placeholder="Buscar por nombre, correo o ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <ResourceState resource={resource}>
          {(users) => {
            const filtered = users.filter((u) =>
              `${u.name} ${u.email} ${u.id}`
                .toLocaleLowerCase("es")
                .includes(query.toLocaleLowerCase("es")),
            );
            return (
              <>
                {filtered.length ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Correo electrónico</th>
                          <th>Perfil</th>
                          <th>Estado</th>
                          <th>
                            <span className="sr-only">Acciones</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <Link
                                className="row-title"
                                to={`/usuarios/${u.id}`}
                              >
                                {u.name}
                              </Link>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <Badge>{roleLabel(u.role)}</Badge>
                            </td>
                            <td>
                              <Badge>{u.active ? "Activo" : "Inactivo"}</Badge>
                            </td>
                            <td>
                              <Link
                                className="icon-button"
                                aria-label={`Ver ${u.name}`}
                                to={`/usuarios/${u.id}`}
                              >
                                <ArrowUpRight size={19} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState />
                )}
                <div className="table-footer">
                  {filtered.length} de {users.length} usuarios
                </div>
              </>
            );
          }}
        </ResourceState>
      </section>
    </>
  );
}
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
export function UserEditor({ profile = false }) {
  const params = useParams();
  const { user } = useApp();
  const id = profile ? user.id : params.id;
  return id ? (
    <ExistingUser id={id} profile={profile} />
  ) : (
    <UserForm key="new" />
  );
}
function ExistingUser({ id, profile }) {
  const resource = useResource("getUser", id);
  return (
    <ResourceState resource={resource}>
      {(target) => <UserForm key={id} target={target} profile={profile} />}
    </ResourceState>
  );
}
function UserForm({ target, profile }) {
  const { user, repository, refresh } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const back = profile
    ? "/perfil"
    : target
      ? `/usuarios/${target.id}`
      : "/usuarios";
  const canManage = user.role === "admin" && target?.id !== user.id;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.role = canManage ? values.role : target.role;
    values.active = canManage ? values.active === "true" : target.active;
    try {
      const saved = await repository.saveUser(values, target?.id);
      await refresh(target ? "Usuario actualizado." : "Usuario registrado.");
      navigate(profile ? "/perfil" : `/usuarios/${saved.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <BackLink to={back} />
      <PageHeading
        eyebrow="MÓDULO DE USUARIOS"
        title={target ? "Editar usuario" : "Registrar usuario"}
        description="Gestiona los datos de la cuenta. Los campos con * son obligatorios."
      />
      <div className="detail-grid">
        <section className="panel">
          <form onSubmit={submit}>
            <ErrorMessage message={error} />
            <Field
              label="Nombre completo"
              name="name"
              defaultValue={target?.name}
              minLength={3}
              maxLength={80}
              autoComplete="name"
              required
            />
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              defaultValue={target?.email}
              maxLength={120}
              autoComplete="email"
              required
            />
            <Field
              label={target ? "Nueva contraseña" : "Contraseña"}
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required={!target}
              hint={
                target
                  ? "Déjala vacía para conservar la contraseña actual."
                  : "Mínimo 8 caracteres. Utiliza una contraseña de prueba."
              }
            />
            {canManage && (
              <div className="form-grid">
                <Field label="Perfil" name="role">
                  <select
                    id="role"
                    name="role"
                    defaultValue={target?.role || "student"}
                  >
                    <option value="student">Estudiante</option>
                    <option value="admin">Administrador</option>
                  </select>
                </Field>
                <Field label="Estado de la cuenta" name="active">
                  <select
                    id="active"
                    name="active"
                    defaultValue={String(target?.active ?? true)}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </Field>
              </div>
            )}
            <div className="form-actions">
              <button className="button primary" disabled={busy}>
                {busy
                  ? "Guardando…"
                  : target
                    ? "Guardar cambios"
                    : "Registrar usuario"}
              </button>
              <Link className="button secondary" to={back}>
                Cancelar
              </Link>
            </div>
          </form>
        </section>
        <aside className="help-card">
          <span className="stat-icon green">
            <Users size={22} />
          </span>
          <h3>Cada perfil, su espacio</h3>
          <p>
            <strong>Estudiante</strong>
            <br />
            Registra y consulta sus propias solicitudes.
          </p>
          <p>
            <strong>Administrador</strong>
            <br />
            Gestiona usuarios y todas las solicitudes.
          </p>
          <small>
            El autorregistro público siempre crea una cuenta de estudiante.
          </small>
        </aside>
      </div>
    </>
  );
}
