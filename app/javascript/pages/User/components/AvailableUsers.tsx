import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import UsersList from "./UsersList";

function AvailableUsers({
  hoveredTimeSlot,
}: {
  hoveredTimeSlot: number | null;
}) {
  const { groupTimeSlots, users } = useAvailabilityContext();

  const availableUsers = hoveredTimeSlot
    ? groupTimeSlots[hoveredTimeSlot]
    : users;

  return (
    <div>
      <div className="font-medium underline mb-2">Responders</div>
      <UsersList users={availableUsers} />
    </div>
  );
}

export default AvailableUsers;
