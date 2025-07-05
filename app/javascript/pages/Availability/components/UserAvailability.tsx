import AvailabilityGrid from "./AvailabilityGrid";
import {
  AvailabilityProps,
  EventProps,
  UserProps,
} from "@/pages/Event/event.types";
import GroupAvailability from "./GroupAvailability";
import { usePage } from "@inertiajs/react";
import useUserAvailability from "@/hooks/useUserAvailability";
import { useAvailabilityContext } from "../context/AvailabilityContext";

function UserAvailability({ event }: { event: EventProps }) {
  // @ts-ignore
  const { current_user }: { current_user: UserProps } = usePage().props;
  const { userTimeSlots } = useAvailabilityContext();
  const { handleTimeSlotClick } = useUserAvailability({ current_user, event });

  const getCurrentUserTimeSlotColor = (id: number) => {
    const selected = userTimeSlots.some(
      (uts: AvailabilityProps) => uts.time_slot_id === id,
    );
    return selected ? "oklch(62.7% 0.265 303.9)" : "oklch(96.7% 0.003 264.542)";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-15">
      <div className="flex flex-col gap-10 items-center">
        <div className="text-md font-bold underline underline-offset-4">
          Choose your availability{" "}
          <span className="text-purple-600">{current_user.name}</span>
        </div>
        <AvailabilityGrid
          eventTimeSlots={event.time_slots}
          color={(id: number) => getCurrentUserTimeSlotColor(id)}
          handleTimeSlotClick={handleTimeSlotClick}
        />
      </div>
      <GroupAvailability eventTimeSlots={event.time_slots} />
    </div>
  );
}

export default UserAvailability;
