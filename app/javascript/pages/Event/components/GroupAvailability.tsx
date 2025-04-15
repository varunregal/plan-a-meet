import { useEffect, useMemo, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { TimeSlotProps } from "../event.types";
import { format } from "date-fns";

// prepare this timeslots into map, so the date is the key and the timeslots are values
//

function GroupAvailability({ timeSlots }: { timeSlots: TimeSlotProps[] }) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});

  useEffect(() => {
    setTsMap(prepareTimeSlots(timeSlots));
  }, [timeSlots]);

  return (
    <div>
      <div className="flex gap-2">
        {Object.entries(tsMap).map(([date, slots]) => {
          return (
            <div className="flex flex-col gap-[1px]">
              <div className="flex flex-col items-center">
                <div>{format(date, "MMM d")}</div>
                <div>{format(date, "iii")}</div>
              </div>
              {slots.map((slot: TimeSlotProps) => {
                return <TimeSlot slot={slot} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default GroupAvailability;
