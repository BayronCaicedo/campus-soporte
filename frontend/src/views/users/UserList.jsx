import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { useResource } from "../../hooks/useResource.js";
import {
  Badge,
  EmptyState,
  PageHeading,
  ResourceState,
} from "../common/ui.jsx";
import { roleLabel } from "../../utils/formatters.js";

export function UserList() {
  const resource = useResource("listUsers");
  const [query, setQuery] = useState("");
  return (
    <>
      <PageHeading
        eyebrow="MÓDULO DE USUARIOS"
        title="Nuestra comunidad"
        description="Administra las cuentas y los perfiles de acceso al campus."
      >
        <Link className="button primary" to="/usuarios/nuevo">
          <Plus size={18} />
          Registrar usuario
        </Link>
      </PageHeading>
      <section className="panel table-panel">
        <div className="filters">
          <div className="search-field">
            <Search size={18} />
            <input
              aria-label="Buscar usuarios"
              placeholder="Buscar por nombre, correo o ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <ResourceState resource={resource}>
          {(users) => {
            const filtered = users.filter((u) =>
              `${u.name} ${u.email} ${u.id}`
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
                          <th>Usuario</th>
                          <th>Correo electrónico</th>
                          <th>Perfil</th>
                          <th>Estado</th>
                          <th>
                            <span className="sr-only">Acciones</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <Link
                                className="row-title"
                                to={`/usuarios/${u.id}`}
                              >
                                {u.name}
                              </Link>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <Badge>{roleLabel(u.role)}</Badge>
                            </td>
                            <td>
                              <Badge>{u.active ? "Activo" : "Inactivo"}</Badge>
                            </td>
                            <td>
                              <Link
                                className="icon-button"
                                aria-label={`Ver ${u.name}`}
                                to={`/usuarios/${u.id}`}
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
                  <EmptyState />
                )}
                <div className="table-footer">
                  {filtered.length} de {users.length} usuarios
                </div>
              </>
            );
          }}
        </ResourceState>
      </section>
    </>
  );
}
