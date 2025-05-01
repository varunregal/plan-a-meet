import AvailabilityGrid from "./AvailabilityGrid";
import { EventProps, UserProps } from "@/pages/Event/event.types";
import GroupAvailability from "./GroupAvailability";
import { usePage } from "@inertiajs/react";
import useUserAvailability from "@/hooks/useUserAvailability";
import { getCurrentUserTimeSlotColor } from "@/lib/getCurrentUserTimeSlotColors";

function UserAvailability({ event }: { event: EventProps }) {
  // @ts-ignore
  const { current_user }: { current_user: UserProps } = usePage().props;
  const { handleTimeSlotClick } = useUserAvailability({ current_user, event });

  return (
    <div>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-10 items-center">
          <div className="text-md font-medium">Your Availability</div>
          <AvailabilityGrid
            eventTimeSlots={event.time_slots}
            color={(id: number) => getCurrentUserTimeSlotColor(id)}
            handleTimeSlotClick={handleTimeSlotClick}
          />
        </div>
        <GroupAvailability eventTimeSlots={event.time_slots} />
      </div>
    </div>
  );
}

export default UserAvailability;
