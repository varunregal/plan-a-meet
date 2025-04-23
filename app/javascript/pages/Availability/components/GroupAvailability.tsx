import { useEffect, useState } from "react";
import { TimeSlotProps } from "../../Event/event.types";
import { getUserGroupAvailabilities } from "@/api/availability";
import { getColor } from "@/lib/getColor";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import AvailableUsers from "@/pages/User/components/AvailableUsers";
import UnavailableUsers from "@/pages/User/components/UnavailableUsers";
import { prepareGroupTimeSlots } from "@/lib/prepareGroupTimeSlots";
import AvailabilityGrid from "./AvailabilityGrid";

function GroupAvailability({
  url,
  eventTimeSlots,
}: {
  url: string;
  eventTimeSlots: TimeSlotProps[];
}) {
  const { groupTimeSlots, dispatch, users } = useAvailabilityContext();
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState<number | null>(null);

  useEffect(() => {
    const getAvailabilities = async () => {
      const response = await getUserGroupAvailabilities(url);
      if (response.success) {
        const availabilitiesObj = prepareGroupTimeSlots(
          response.data.availabilities
        );
        dispatch({ type: "SET_GROUP_TIME_SLOTS", payload: availabilitiesObj });
        dispatch({ type: "SET_USERS", payload: response.data.users });
      } else console.warn(response.message);
    };
    getAvailabilities();
  }, []);

  const getTimeSlotColor = (id: number) => {
    return getColor((groupTimeSlots[id] || []).length, users.length);
  };

  console.log(hoveredTimeSlot);
  return (
    <div className="flex flex-col gap-10">
      <div className="font-bold text-md">Group Availability</div>
      <AvailabilityGrid
        eventTimeSlots={eventTimeSlots}
        color={(id: number) => getTimeSlotColor(id)}
        handleTimeSlotClick={() => {}}
        setHoveredTimeSlot={setHoveredTimeSlot}
      />

      <div className="grid grid-cols-2 gap-5">
        <AvailableUsers hoveredTimeSlot={hoveredTimeSlot} />
        <UnavailableUsers hoveredTimeSlot={hoveredTimeSlot} />
      </div>
    </div>
  );
}
export default GroupAvailability;
