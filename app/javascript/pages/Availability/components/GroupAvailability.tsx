import { useState } from "react";
import { TimeSlotProps } from "../../Event/event.types";

import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import AvailableUsers from "@/pages/User/components/AvailableUsers";
import AvailabilityGrid from "./AvailabilityGrid";
import { getSlotColor } from "@/lib/getColor";

function GroupAvailability({
  eventTimeSlots,
  canSchedule,
  handleTimeSlotClick,
}: {
  eventTimeSlots: TimeSlotProps[];
  canSchedule?: boolean;
  handleTimeSlotClick: (time_slot_id: number) => void;
}) {
  const { groupTimeSlots, users } = useAvailabilityContext();
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="font-bold text-md text-center underline">
        Group Availability
      </div>
      <AvailabilityGrid
        eventTimeSlots={eventTimeSlots}
        color={(id: number) =>
          getSlotColor(groupTimeSlots[id]?.length || 0, users.length)
        }
        handleTimeSlotClick={handleTimeSlotClick}
        setHoveredTimeSlot={setHoveredTimeSlot}
      />
      <div className="p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-900 text-sm rounded">
        💡 <strong>Note:</strong> Hover over the time slots to view
        availabilities.
      </div>
      <div className="grid grid-cols-1 gap-5">
        <AvailableUsers hoveredTimeSlot={hoveredTimeSlot} />
      </div>
    </div>
  );
}

export default GroupAvailability;
