import { useParams } from "react-router-dom";
import { useApp } from "../../hooks/useApp.js";
import { useResource } from "../../hooks/useResource.js";
import { BackLink, ErrorMessage, ResourceState } from "../../components/ui.jsx";
import { TicketForm } from "./TicketForm.jsx";

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
