import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Ticket,
  Clock3,
  CircleCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useResource } from "../../hooks/useResource.js";
import {
  Badge,
  EmptyState,
  PageHeading,
  ResourceState,
} from "../common/ui.jsx";
import { dateLabel } from "../../utils/formatters.js";

export default function Dashboard() {
  const { user } = useApp();
  const resource = useResource("listTickets");
  return (
    <>
      <PageHeading
        eyebrow="TU ESPACIO DE TRABAJO"
        title={`Hola, ${user.name.split(" ")[0]} 👋`}
        description="Todo lo que necesitas para seguir avanzando."
      />
      <section className="hero">
        <div>
          <span className="pill">ESTAMOS PARA AYUDARTE</span>
          <h2>
            Una solución empieza
            <br />
            con una solicitud.
          </h2>
          <p>
            Cuéntanos qué sucede. Desde aquí puedes
            <br className="desktop-break" /> crear, consultar y dar seguimiento
            a cada caso.
          </p>
          <Link to="/solicitudes/nueva" className="button light">
            <Plus size={18} />
            Nueva solicitud
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="floating-ticket">
            <span className="art-icon">
              <Ticket size={30} />
            </span>
            <div className="art-line" />
            <div className="art-line short" />
            <div className="art-bottom">
              <span />
              Todo bajo control
              <CircleCheck size={19} />
            </div>
          </div>
          <div className="floating-check">
            <CircleCheck size={30} />
          </div>
        </div>
      </section>
      <ResourceState resource={resource}>
        {(tickets) => (
          <>
            <div className="stats">
              {[
                {
                  label: "Solicitudes totales",
                  count: tickets.length,
                  icon: Ticket,
                  color: "neutral",
                  foot:
                    user.role === "admin"
                      ? "En la mesa de ayuda"
                      : "Registradas por ti",
                },
                {
                  label: "Pendientes",
                  count: tickets.filter((t) => t.status === "Pendiente").length,
                  icon: Clock3,
                  color: "amber",
                  foot: "Por revisar",
                },
                {
                  label: "En proceso",
                  count: tickets.filter((t) => t.status === "En proceso")
                    .length,
                  icon: Activity,
                  color: "blue",
                  foot: "Estamos trabajando en ellas",
                },
                {
                  label: "Resueltas",
                  count: tickets.filter((t) => t.status === "Resuelta").length,
                  icon: CircleCheck,
                  color: "green",
                  foot: "Casos completados",
                },
              ].map(({ label, count, icon: Icon, color, foot }) => (
                <article className="stat-card" key={label}>
                  <div>
                    <span>{label}</span>
                    <span className={`stat-icon ${color}`}>
                      <Icon size={19} />
                    </span>
                  </div>
                  <strong>{String(count).padStart(2, "0")}</strong>
                  <small>{foot}</small>
                </article>
              ))}
            </div>
            <section className="panel table-panel">
              <div className="section-heading">
                <div>
                  <h2>Solicitudes recientes</h2>
                  <p className="muted">Un vistazo a las últimas novedades.</p>
                </div>
                <Link to="/solicitudes" className="text-link">
                  Ver todas <ArrowRight size={16} />
                </Link>
              </div>
              {tickets.length ? (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Solicitud</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.slice(0, 5).map((t) => (
                        <tr key={t.id}>
                          <td>
                            <Link
                              className="row-title"
                              to={`/solicitudes/${t.id}`}
                            >
                              {t.title}
                            </Link>
                            <small>{t.userName}</small>
                          </td>
                          <td>{t.category}</td>
                          <td>
                            <Badge>{t.status}</Badge>
                          </td>
                          <td className="nowrap">{dateLabel(t.createdAt)}</td>
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
                  title="Tu primera solicitud empieza aquí"
                  description="Cuando registres un caso, podrás seguir su estado desde este espacio."
                />
              )}
            </section>
            <div className="bottom-note">
              <CircleCheck size={19} />
              <p>
                <strong>Todo en un mismo lugar.</strong> Consulta el detalle de
                cada solicitud para conocer su estado actual.
              </p>
            </div>
          </>
        )}
      </ResourceState>
    </>
  );
}
