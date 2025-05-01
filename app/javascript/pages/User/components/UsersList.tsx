import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import { UserProps } from "@/pages/Event/event.types";

function UsersList({ users }: { users: UserProps[] }) {
  const { users: allUsers } = useAvailabilityContext();

  const availableUserIds = (users || []).map((user: UserProps) => user.id);
  return (
    <div className="flex flex-col gap-2">
      {allUsers?.map((user: UserProps) => (
        <div className="font-medium text-md" key={user.id}>
          {availableUserIds.includes(user.id) ? (
            <span>{user.name}</span>
          ) : (
            <s className="text-gray-400">{user.name}</s>
          )}
        </div>
      ))}
    </div>
  );
}

export default UsersList;
