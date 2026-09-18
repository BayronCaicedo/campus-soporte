import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { CATEGORIES, PRIORITIES, STATUSES } from "../../config/constants.js";
import {
  BackLink,
  ErrorMessage,
  Field,
  PageHeading,
} from "../../components/ui.jsx";

export function TicketForm({ ticket }) {
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
