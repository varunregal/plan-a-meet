import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import UsersList from "./UsersList";

function AvailableUsers({
  hoveredTimeSlot,
}: {
  hoveredTimeSlot: number | null;
}) {
  const { groupTimeSlots, users } = useAvailabilityContext();
  const currentAvailableUsersCount =
    (hoveredTimeSlot && groupTimeSlots[hoveredTimeSlot]?.length) || 0;
  const totalUsers = users.length;
  const availableUsers = hoveredTimeSlot ? groupTimeSlots[hoveredTimeSlot] : [];
  return (
    <div>
      <div className="font-medium text-sm underline mb-2">
        Available {`(${currentAvailableUsersCount}/${totalUsers})`}
      </div>
      <UsersList users={availableUsers} />
    </div>
  );
}

export default AvailableUsers;
