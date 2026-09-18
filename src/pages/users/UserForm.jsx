import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import {
  BackLink,
  ErrorMessage,
  Field,
  PageHeading,
} from "../../components/ui.jsx";

export function UserForm({ target, profile }) {
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
