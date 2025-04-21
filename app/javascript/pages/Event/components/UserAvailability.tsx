import { useEffect, useState } from "react";
import { TimeSlotProps } from "../event.types";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { format } from "date-fns";
import TimeSlot from "./TimeSlot";
import { createUserAvailability } from "@/api/availability";
import { getColor } from "@/lib/getColor";

function UserAvailability({
  timeSlots,
  url,
  userId,
  userSelectedSlots,
}: {
  timeSlots: TimeSlotProps[];
  url: string;
  userId: number;
  userSelectedSlots: any;
}) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});
  const [userTimeSlots, setUserTimeSlots] = useState(userSelectedSlots);

  useEffect(() => {
    setTsMap(prepareTimeSlots(timeSlots));
  }, [timeSlots]);

  const handleTimeSlotClick = async (slot: number) => {
    const availability = {
      user_id: userId,
      time_slots: [slot],
    };
    const response = await createUserAvailability(url, availability);
    if (response.success)
      setUserTimeSlots((prev: number[]) => [
        ...prev,
        ...response.data.availabilities,
      ]);
    else {
      console.warn("unable to create a time slot");
    }
  };
  return (
    <div className="flex flex-col gap-10">
      <div className="font-bold text-md">Please select your availability</div>
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
                    color={`${
                      userTimeSlots.includes(slot.id)
                        ? getColor(1, 1)
                        : getColor(0, 1)
                    }`}
                    key={slot.id}
                    column={index}
                    onClick={handleTimeSlotClick}
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

export default UserAvailability;
