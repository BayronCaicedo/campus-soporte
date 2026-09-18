import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useResource } from "../../hooks/useResource.js";
import { STATUSES } from "../../config/constants.js";
import {
  Badge,
  EmptyState,
  PageHeading,
  ResourceState,
} from "../../components/ui.jsx";
import { dateLabel } from "../../utils/formatters.js";

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
