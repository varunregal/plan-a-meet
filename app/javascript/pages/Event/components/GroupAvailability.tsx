import { useEffect, useMemo, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { TimeSlotProps } from "../event.types";

// prepare this timeslots into map, so the date is the key and the timeslots are values
//

function GroupAvailability({ timeSlots }: { timeSlots: TimeSlotProps[] }) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});

  useEffect(() => {
    setTsMap(prepareTimeSlots(timeSlots));
  }, [timeSlots]);
  
  console.log(tsMap)
  return (
    <div>
      <div className="flex gap-2">
        {Object.entries(tsMap).map(([date, slots]) => {
          return <div className="flex flex-col gap-[1px]"> {date}
          {slots.map((slot: TimeSlotProps) => {
            return <TimeSlot slot={slot}/>
          })}
          </div>

        })}
      </div>
      {/* {Array.from(tsMap.keys()).map((ts: any) => {
        console.log(tsMap.get(ts));
        return tsMap.get(ts).map((item: any) => {
          return <div>{item.start_time}</div>;
        });
      })} */}
    </div>
  );
}
export default GroupAvailability;
