import { useEffect, useState } from "react";
import { TimeSlotProps } from "../event.types";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { format } from "date-fns";
import TimeSlot from "./TimeSlot";

function UserAvailability({ timeSlots }: { timeSlots: TimeSlotProps[] }) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});

  useEffect(() => {
    setTsMap(prepareTimeSlots(timeSlots));
  }, [timeSlots]);
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
                return <TimeSlot slot={slot} key={slot.id} column={index} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserAvailability;
