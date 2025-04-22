import { useEffect, useState } from "react";
import { TimeSlotProps } from "../event.types";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { format } from "date-fns";
import TimeSlot from "./TimeSlot";
import { createUserAvailability } from "@/api/availability";
import { getColor } from "@/lib/getColor";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";

function UserAvailability({
  url,
  eventTimeSlots,
}: {
  url: string;
  eventTimeSlots: TimeSlotProps[];
}) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});
  const { userId, userTimeSlots, dispatch } = useAvailabilityContext();

  useEffect(() => {
    setTsMap(prepareTimeSlots(eventTimeSlots));
  }, [eventTimeSlots]);

  const handleTimeSlotClick = async (slot: number) => {
    const availability = {
      user_id: userId,
      time_slot: slot,
    };
    const response = await createUserAvailability(url, availability);
    console.log({ response });
    if (response.success && userId) {
      dispatch({
        type: "ADD_USER_SLOT",
        // payload: response.data.availability.time_slot_id,
        payload: {
          userId,
          time_slot_id: response.data.availability.time_slot_id,
        },
      });
    } else {
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
