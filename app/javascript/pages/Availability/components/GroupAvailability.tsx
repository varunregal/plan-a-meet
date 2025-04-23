import { useEffect, useRef, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { AvailabilityProps, TimeSlotProps } from "../../Event/event.types";
import { format } from "date-fns";
import { getUserGroupAvailabilities } from "@/api/availability";
import { getColor } from "@/lib/getColor";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";

function prepareGroupTimeSlots(availabilities: any) {
  return availabilities.reduce(
    (acc: Record<number, number[]>, current: AvailabilityProps) => {
      if (current.time_slot_id) {
        acc[current.time_slot_id] = acc[current.time_slot_id] || [];
        acc[current.time_slot_id].push(current.user_id);
      }
      return acc;
    },
    {}
  );
}

function GroupAvailability({
  url,
  eventTimeSlots,
}: {
  url: string;
  eventTimeSlots: TimeSlotProps[];
}) {
  const { groupTimeSlots, dispatch, users } = useAvailabilityContext();
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});

  useEffect(() => {
    const getAvailabilities = async () => {
      const response = await getUserGroupAvailabilities(url);
      if (response.success) {
        console.log(response.data);
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

  return (
    <div className="flex flex-col gap-10">
      <div className="font-bold text-md">Group Availability</div>
      <div className="flex gap-2 max-w-[340px] overflow-scroll">
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
      <div className="grid grid-cols-2 gap-10">
        <div className="text-sm font-medium underline">Available</div>
        <div className="text-sm font-medium underline">Unavailable</div>
      </div>
    </div>
  );
}
export default GroupAvailability;
