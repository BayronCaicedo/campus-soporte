import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  Plus,
  Search,
  Pencil,
  Trash2,
  Ticket,
  UserRound,
  CalendarDays,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useResource } from "../hooks/useResource.js";
import { CATEGORIES, PRIORITIES, STATUSES } from "../services/repository.js";
import {
  BackLink,
  Badge,
  ConfirmDialog,
  dateLabel,
  EmptyState,
  ErrorMessage,
  Field,
  PageHeading,
  ResourceState,
} from "../components/ui.jsx";

export function TicketList() {
  const { user } = useApp();
  const resource = useResource("listTickets");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  return (
    <>
      <PageHeading
        eyebrow="MÓDULO DE SOLICITUDES"
        title={user.role === "admin" ? "Solicitudes" : "Mis solicitudes"}
        description={
          user.role === "admin"
            ? "Organiza y da seguimiento a los casos de la comunidad."
            : "Consulta y gestiona tus solicitudes de soporte."
        }
      >
        <Link className="button primary" to="/solicitudes/nueva">
          <Plus size={18} />
          Nueva solicitud
        </Link>
      </PageHeading>
      <section className="panel table-panel">
        <div className="filters">
          <div className="search-field">
            <Search size={18} />
            <input
              aria-label="Buscar solicitudes"
              placeholder="Buscar por asunto o ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <ResourceState resource={resource}>
          {(tickets) => {
            const filtered = tickets.filter(
              (t) =>
                (status === "Todos" || t.status === status) &&
                `${t.title} ${t.id}`
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
                          <th>Solicitud</th>
                          {user.role === "admin" && <th>Solicitante</th>}
                          <th>Categoría</th>
                          <th>Prioridad</th>
                          <th>Estado</th>
                          <th>
                            <span className="sr-only">Acciones</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <Link
                                className="row-title"
                                to={`/solicitudes/${t.id}`}
                              >
                                {t.title}
                              </Link>
                              <small>{dateLabel(t.createdAt)}</small>
                            </td>
                            {user.role === "admin" && <td>{t.userName}</td>}
                            <td>{t.category}</td>
                            <td>
                              <Badge>{t.priority}</Badge>
                            </td>
                            <td>
                              <Badge>{t.status}</Badge>
                            </td>
                            <td>
                              <Link
                                className="icon-button"
                                aria-label={`Ver ${t.title}`}
                                to={`/solicitudes/${t.id}`}
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
                  <EmptyState
                    title={
                      tickets.length
                        ? "No encontramos coincidencias"
                        : "Todavía no tienes solicitudes"
                    }
                    description={
                      tickets.length
                        ? "Cambia el texto de búsqueda o el filtro de estado."
                        : "Registra tu primer caso para empezar a recibir soporte."
                    }
                  >
                    {!tickets.length && (
                      <Link className="button primary" to="/solicitudes/nueva">
                        Crear solicitud
                      </Link>
                    )}
                  </EmptyState>
                )}
                <div className="table-footer">
                  {filtered.length} de {tickets.length} solicitudes
                </div>
              </>
            );
          }}
        </ResourceState>
      </section>
    </>
  );
}

export function TicketDetail() {
  const { id } = useParams();
  const resource = useResource("getTicket", id);
  const { user, repository, refresh } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await repository.deleteTicket(id);
      await refresh("Solicitud eliminada.");
      navigate("/solicitudes");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <BackLink to="/solicitudes" />
      <ResourceState resource={resource}>
        {(ticket) => {
          const canEdit =
            user.role === "admin" || ticket.status === "Pendiente";
          return (
            <>
              <PageHeading
                eyebrow="DETALLE DE LA SOLICITUD"
                title={ticket.title}
              >
                <Badge>{ticket.status}</Badge>
              </PageHeading>
              <div className="detail-grid">
                <section className="panel">
                  <h2>Descripción del caso</h2>
                  <p className="description-text">{ticket.description}</p>
                  {canEdit ? (
                    <div className="form-actions">
                      <Link
                        className="button primary"
                        to={`/solicitudes/${id}/editar`}
                      >
                        <Pencil size={17} />
                        Editar solicitud
                      </Link>
                      <button
                        className="button danger-outline"
                        onClick={() => {
                          setError("");
                          setOpen(true);
                        }}
                      >
                        <Trash2 size={17} />
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <div className="info-note">
                      Tu solicitud ya está siendo atendida. La edición y
                      eliminación están disponibles solo en estado pendiente.
                    </div>
                  )}
                </section>
                <aside className="panel detail-meta">
                  <h2>Información</h2>
                  <dl>
                    <dt>
                      <Ticket size={16} />
                      Identificador
                    </dt>
                    <dd className="identifier">{ticket.id}</dd>
                    <dt>
                      <UserRound size={16} />
                      Solicitante
                    </dt>
                    <dd>{ticket.userName}</dd>
                    <dt>
                      <CalendarDays size={16} />
                      Fecha de creación
                    </dt>
                    <dd>{dateLabel(ticket.createdAt)}</dd>
                    <dt>Categoría</dt>
                    <dd>{ticket.category}</dd>
                    <dt>Prioridad</dt>
                    <dd>
                      <Badge>{ticket.priority}</Badge>
                    </dd>
                  </dl>
                </aside>
              </div>
              <ConfirmDialog
                open={open}
                title="¿Eliminar esta solicitud?"
                description={`Se eliminará «${ticket.title}» de esta demostración. Esta acción no se puede deshacer.`}
                onClose={() => setOpen(false)}
                onConfirm={remove}
                busy={busy}
                error={error}
              />
            </>
          );
        }}
      </ResourceState>
    </>
  );
}

export function TicketEditor() {
  const { id } = useParams();
  if (id) return <ExistingTicket id={id} />;
  return <TicketForm key="new" />;
}
function ExistingTicket({ id }) {
  const resource = useResource("getTicket", id);
  const { user } = useApp();
  return (
    <ResourceState resource={resource}>
      {(ticket) =>
        user.role !== "admin" && ticket.status !== "Pendiente" ? (
          <div className="panel">
            <ErrorMessage message="Solo puedes editar solicitudes pendientes." />
            <BackLink to={`/solicitudes/${id}`} />
          </div>
        ) : (
          <TicketForm key={id} ticket={ticket} />
        )
      }
    </ResourceState>
  );
}
function TicketForm({ ticket }) {
  const { user, repository, refresh } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const back = ticket ? `/solicitudes/${ticket.id}` : "/solicitudes";
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const saved = await repository.saveTicket(values, ticket?.id);
      await refresh(
        ticket ? "Solicitud actualizada." : "Solicitud registrada.",
      );
      navigate(`/solicitudes/${saved.id}`);
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
        eyebrow="MÓDULO DE SOLICITUDES"
        title={ticket ? "Editar solicitud" : "Cuéntanos qué necesitas"}
        description="Una descripción clara nos ayuda a entender mejor tu caso."
      />
      <div className="detail-grid">
        <section className="panel">
          <h2>{ticket ? "Datos de la solicitud" : "Nueva solicitud"}</h2>
          <p className="muted">Los campos con * son obligatorios.</p>
          <form onSubmit={submit}>
            <ErrorMessage message={error} />
            <Field
              label="Asunto"
              name="title"
              placeholder="Ej. No puedo ingresar al aula virtual"
              defaultValue={ticket?.title}
              minLength={5}
              maxLength={100}
              required
            />
            <div className="form-grid">
              <Field label="Categoría" name="category" required>
                <select
                  id="category"
                  name="category"
                  defaultValue={ticket?.category || ""}
                  required
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Prioridad" name="priority" required>
                <select
                  id="priority"
                  name="priority"
                  defaultValue={ticket?.priority || "Media"}
                  required
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              label="Descripción"
              name="description"
              required
              hint="Entre 15 y 2.000 caracteres. No incluyas contraseñas ni información sensible."
            >
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe lo que sucede, dónde ocurre y qué has intentado…"
                minLength={15}
                maxLength={2000}
                defaultValue={ticket?.description}
                required
              />
            </Field>
            {user.role === "admin" && (
              <Field label="Estado" name="status">
                <select
                  id="status"
                  name="status"
                  defaultValue={ticket?.status || "Pendiente"}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            )}
            <div className="form-actions">
              <button className="button primary" disabled={busy}>
                {busy
                  ? "Guardando…"
                  : ticket
                    ? "Guardar cambios"
                    : "Registrar solicitud"}
              </button>
              <Link className="button secondary" to={back}>
                Cancelar
              </Link>
            </div>
          </form>
        </section>
        <aside className="help-card">
          <span className="stat-icon green">
            <Ticket size={22} />
          </span>
          <h3>Una buena solicitud incluye…</h3>
          <p>
            <strong>Un asunto concreto.</strong>
            <br />
            Resume el problema en una frase.
          </p>
          <p>
            <strong>El contexto necesario.</strong>
            <br />
            Indica la plataforma, el equipo o el lugar.
          </p>
          <p>
            <strong>Lo que ya intentaste.</strong>
            <br />
            Así podremos entender mejor la situación.
          </p>
          <small>Podrás editar tu solicitud mientras esté pendiente.</small>
        </aside>
      </div>
    </>
  );
}
