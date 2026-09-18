import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { Brand } from "../components/Brand.jsx";
import { ErrorMessage, Field } from "../components/ui.jsx";
import { useApp } from "../hooks/useApp.js";
import { validatePasswordConfirmation } from "../utils/validators.js";

export default function Auth({ register = false }) {
  const { user, repository, refresh } = useApp();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (user) return <Navigate to="/inicio" replace />;
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (register) {
        validatePasswordConfirmation(values.password, values.confirmPassword);
        await repository.register(values);
        await refresh("Cuenta creada. Ya puedes iniciar sesión.");
        navigate("/ingresar");
      } else {
        await repository.login(values.email, values.password);
        await refresh("Sesión iniciada. Bienvenido a Campus Soporte.");
        navigate("/inicio");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-shell">
      <section className="auth-story">
        <Brand />
        <div className="auth-message">
          <span className="pill">TU CAMPUS, MÁS CERCA</span>
          <h1>
            Menos obstáculos.
            <br />
            <em>Más aprendizaje.</em>
          </h1>
          <p>
            El punto de encuentro entre tus solicitudes y las soluciones que
            necesitas.
          </p>
          <div className="auth-benefits">
            {[
              "Registra lo que necesitas",
              "Consulta el estado de tu solicitud",
              "Continúa con lo que importa",
            ].map((t) => (
              <div key={t}>
                <CheckCircle2 size={19} />
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="auth-footer">
          <GraduationCap size={19} /> Ingeniería Web II · Proyecto académico
        </p>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">MESA DE AYUDA UNIVERSITARIA</p>
          <h2>{register ? "Crea tu cuenta" : "Qué bueno verte"}</h2>
          <p className="muted">
            {register
              ? "Regístrate como estudiante y encuentra ayuda para tu día a día."
              : "Ingresa para gestionar tus solicitudes de soporte."}
          </p>
          <form onSubmit={submit}>
            <ErrorMessage message={error} />
            {register && (
              <Field
                label="Nombre completo"
                name="name"
                autoComplete="name"
                minLength={3}
                maxLength={80}
                required
              />
            )}
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu.correo@universidad.edu"
              autoComplete="username"
              maxLength={120}
              required
            />
            <Field
              label="Contraseña"
              name="password"
              type="password"
              autoComplete={register ? "new-password" : "current-password"}
              minLength={register ? 8 : undefined}
              maxLength={128}
              required
              hint={
                register
                  ? "Mínimo 8 caracteres. Utiliza una contraseña de prueba."
                  : undefined
              }
            />
            {register && (
              <Field
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
              />
            )}
            <button className="button primary full" disabled={busy}>
              {busy
                ? "Procesando…"
                : register
                  ? "Crear cuenta"
                  : "Iniciar sesión"}
              <ArrowRight size={18} />
            </button>
          </form>
          <p className="auth-switch">
            {register ? "¿Ya tienes una cuenta?" : "¿Es tu primera visita?"}{" "}
            <Link to={register ? "/ingresar" : "/registro"}>
              {register ? "Inicia sesión" : "Crea tu cuenta"}
            </Link>
          </p>
          {!register && (
            <div className="demo-accounts">
              <strong>Explora la demostración</strong>
              <p>
                Administrador: <code>admin@campus.demo</code>
                <br />
                Estudiante: <code>estudiante@campus.demo</code>
                <br />
                Contraseña para ambos: <code>Campus123!</code>
              </p>
            </div>
          )}
          <small className="auth-disclaimer">
            Primer corte: acceso simulado y datos guardados en este navegador.
            Usa únicamente datos ficticios.
          </small>
        </div>
      </section>
    </div>
  );
}
