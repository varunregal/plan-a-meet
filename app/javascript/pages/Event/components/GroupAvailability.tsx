import { useEffect, useRef, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { AvailabilityProps, TimeSlotProps } from "../event.types";
import { format } from "date-fns";
import { getUserEventAvailabilities } from "@/api/availability";
import { getColor } from "@/lib/getColor";

/**
 * Display the time slots based on the frequency, we can also track which users have that particular time slot
 * time_slot: [user_id1, user_id2]
 *
 */



function GroupAvailability({
  timeSlots,
  url,
}: {
  timeSlots: TimeSlotProps[];
  url: string;
}) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});
  const [availabilities, setAvailabilities] = useState<Record<number, number[]>>({});
  const numOfUsers = useRef(0);
  useEffect(() => {
    const getAvailabilities = async () => {
      const response = await getUserEventAvailabilities(url);
      if (response.success) {
        const availabilitiesObj = response.data.reduce(
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
        setAvailabilities(availabilitiesObj);
      } else console.warn(response.message);
    };
    getAvailabilities();
  }, []);

  useEffect(() => {
    setTsMap(prepareTimeSlots(timeSlots));
  }, [timeSlots]);

  console.log(availabilities);

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
                      (availabilities[slot.id] || []).length,
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
