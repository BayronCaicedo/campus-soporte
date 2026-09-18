import { useApp } from "./hooks/useApp.js";
import { ErrorMessage } from "./components/ui.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const { loading, fatalError, notice, user } = useApp();
  if (loading)
    return (
      <div className="boot" role="status">
        Preparando Campus Soporte…
      </div>
    );
  if (fatalError)
    return (
      <div className="boot">
        <ErrorMessage message={fatalError} />
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  return (
    <>
      {!user && notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      <AppRoutes />
    </>
  );
}
