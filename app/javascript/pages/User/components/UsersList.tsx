import { UserProps } from "@/pages/Event/event.types";

function UsersList({ users }: { users: UserProps[] }) {
  return (
    <div className="flex flex-col gap-2">
      {users?.map((user: UserProps) => (
        <div className="font-medium text-sm" key={user.id}>
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default UsersList;
