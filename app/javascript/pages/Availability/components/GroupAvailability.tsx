import { useEffect, useRef, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { AvailabilityProps, TimeSlotProps } from "../../Event/event.types";
import { format } from "date-fns";
import { getUserGroupAvailabilities } from "@/api/availability";
import { getColor } from "@/lib/getColor";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";

function prepareGroupTimeSlots(
  availabilities: any,
  numOfUsers: { current: number }
) {
  return availabilities.reduce(
    (acc: Record<number, number[]>, current: AvailabilityProps) => {
      if (current.time_slot_id) {
        acc[current.time_slot_id] = acc[current.time_slot_id] || [];
        acc[current.time_slot_id].push(current.user_id);
        numOfUsers.current = Math.max(
          numOfUsers.current,
          acc[current.time_slot_id].length
        );
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
  const { groupTimeSlots, dispatch } = useAvailabilityContext();
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});

  const numOfUsers = useRef(0);
  useEffect(() => {
    const getAvailabilities = async () => {
      const response = await getUserGroupAvailabilities(url);
      if (response.success) {
        const availabilitiesObj = prepareGroupTimeSlots(
          response.data,
          numOfUsers
        );
        dispatch({ type: "SET_GROUP_TIME_SLOTS", payload: availabilitiesObj });
      } else console.warn(response.message);
    };
    getAvailabilities();
  }, []);

  useEffect(() => {
    setTsMap(prepareTimeSlots(eventTimeSlots));
  }, [eventTimeSlots]);
  console.log({ groupTimeSlots });
  return (
    <div className="flex flex-col gap-10">
      <div className="font-bold text-md">Group Availability</div>
      <div className="flex gap-2">
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
                      numOfUsers.current
                    )}
                    onClick={() => {}}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default GroupAvailability;
