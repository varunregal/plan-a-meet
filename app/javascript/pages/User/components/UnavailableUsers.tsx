import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import { UserProps } from "@/pages/Event/event.types";
import UsersList from "./UsersList";

function UnavailableUsers({
  hoveredTimeSlot,
}: {
  hoveredTimeSlot: number | null;
}) {
  const { groupTimeSlots, users } = useAvailabilityContext();
  const usersInGroupTimeSlotsHoveredState = hoveredTimeSlot
    ? new Set(
        groupTimeSlots[hoveredTimeSlot]?.map((user: UserProps) => user.id)
      )
    : new Set();
  const unavailableUsers = users.filter(
    (user: UserProps) => !usersInGroupTimeSlotsHoveredState.has(user.id)
  );

  return (
    <div>
      <div className="font-medium text-sm underline mb-2">{`Unavailable (${unavailableUsers.length}/${users.length})`}</div>
      <UsersList users={unavailableUsers} />
    </div>
  );
}

export default UnavailableUsers;
