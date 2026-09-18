import { useParams } from "react-router-dom";
import { useApp } from "../../hooks/useApp.js";
import { useResource } from "../../hooks/useResource.js";
import { ResourceState } from "../../components/ui.jsx";
import { UserForm } from "./UserForm.jsx";

export function UserEditor({ profile = false }) {
  const params = useParams();
  const { user } = useApp();
  const id = profile ? user.id : params.id;
  return id ? (
    <ExistingUser id={id} profile={profile} />
  ) : (
    <UserForm key="new" />
  );
}
function ExistingUser({ id, profile }) {
  const resource = useResource("getUser", id);
  return (
    <ResourceState resource={resource}>
      {(target) => <UserForm key={id} target={target} profile={profile} />}
    </ResourceState>
  );
}
