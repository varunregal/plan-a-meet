import { useEffect, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { TimeSlotProps } from "../../Event/event.types";
import { format } from "date-fns";
import { getUserGroupAvailabilities } from "@/api/availability";
import { getColor } from "@/lib/getColor";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import AvailableUsers from "@/pages/User/components/AvailableUsers";
import UnavailableUsers from "@/pages/User/components/UnavailableUsers";
import { prepareGroupTimeSlots } from "@/lib/prepareGroupTimeSlots";

function GroupAvailability({
  url,
  eventTimeSlots,
}: {
  url: string;
  eventTimeSlots: TimeSlotProps[];
}) {
  const { groupTimeSlots, dispatch, users } = useAvailabilityContext();
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});
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

  useEffect(() => {
    setTsMap(prepareTimeSlots(eventTimeSlots));
  }, [eventTimeSlots]);

  console.log(hoveredTimeSlot);
  return (
    <div className="flex flex-col gap-10">
      <div className="font-bold text-md">Group Availability</div>
      <div className="flex gap-2 overflow-scroll pl-20">
        {Object.entries(tsMap).map(([date, slots], index) => {
          return (
            <div className="flex flex-col gap-[1px]" key={date}>
              <div className="flex flex-col items-center text-sm font-medium">
                <div>{format(date, "MMM d")}</div>
                <div>{format(date, "iii")}</div>
              </div>
              {slots.map((slot: TimeSlotProps) => {
                return (
                  <TimeSlot
                    slot={slot}
                    key={slot.id}
                    column={index}
                    setHoveredTimeSlot={(id: number) => setHoveredTimeSlot(id)}
                    color={getColor(
                      (groupTimeSlots[slot.id] || []).length,
                      users.length
                    )}
                    onClick={() => {}}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <AvailableUsers hoveredTimeSlot={hoveredTimeSlot} />
        <UnavailableUsers hoveredTimeSlot={hoveredTimeSlot} />
      </div>
    </div>
  );
}
export default GroupAvailability;
