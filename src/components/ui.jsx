import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Inbox, LoaderCircle, ShieldAlert, X } from "lucide-react";

export const dateLabel = (value) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
export const roleLabel = (role) =>
  role === "admin" ? "Administrador" : "Estudiante";
export function Badge({ children }) {
  const colors = {
    Pendiente: "amber",
    "En proceso": "blue",
    Resuelta: "green",
    Alta: "red",
    Media: "amber",
    Baja: "neutral",
    Administrador: "green",
    Estudiante: "neutral",
    Activo: "green",
    Inactivo: "neutral",
  };
  return (
    <span className={`badge ${colors[children] || "neutral"}`}>{children}</span>
  );
}
export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}
export function BackLink({ to, children = "Volver al listado" }) {
  return (
    <Link className="back-link" to={to}>
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}
export function Field({ label, name, children, hint, ...props }) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      {children || <input id={name} name={name} {...props} />}
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function ErrorMessage({ message }) {
  return message ? (
    <div className="alert error" role="alert">
      <ShieldAlert size={18} />
      <span>{message}</span>
    </div>
  ) : null;
}
export function ResourceState({ resource, children }) {
  if (resource.loading)
    return (
      <div className="empty" role="status">
        <LoaderCircle className="spin" />
        <p>Cargando información…</p>
      </div>
    );
  if (resource.error)
    return (
      <div className="panel">
        <ErrorMessage message={resource.error} />
        <BackLink to="/inicio">Volver al inicio</BackLink>
      </div>
    );
  return children(resource.data);
}
export function EmptyState({
  title = "No hay resultados",
  description = "Prueba con otra búsqueda o cambia los filtros.",
  children,
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Inbox size={30} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  busy,
  error,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      aria-labelledby="confirm-title"
    >
      <div className="dialog-top">
        <span className="eyebrow">Confirmar acción</span>
        <button
          className="icon-button"
          aria-label="Cerrar confirmación"
          disabled={busy}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <h2 id="confirm-title">{title}</h2>
      <p className="muted">{description}</p>
      <ErrorMessage message={error} />
      <div className="form-actions">
        <button className="button secondary" disabled={busy} onClick={onClose}>
          Cancelar
        </button>
        <button className="button danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Eliminando…" : "Sí, eliminar"}
        </button>
      </div>
    </dialog>
  );
}
