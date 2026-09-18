import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, Ticket, UserRound, CalendarDays } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useResource } from "../../hooks/useResource.js";
import {
  BackLink,
  Badge,
  ConfirmDialog,
  PageHeading,
  ResourceState,
} from "../../components/ui.jsx";
import { dateLabel } from "../../utils/formatters.js";

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
