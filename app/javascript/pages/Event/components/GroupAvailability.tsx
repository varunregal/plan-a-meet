import { useEffect, useMemo, useState } from "react";
import TimeSlot from "./TimeSlot";
import prepareTimeSlots from "@/lib/prepareTimeSlots";
import { AvailabilityProps, TimeSlotProps } from "../event.types";
import { format } from "date-fns";
import { getUserEventAvailabilities } from "@/api/availability";

function GroupAvailability({
  timeSlots,
  url,
}: {
  timeSlots: TimeSlotProps[];
  url: string;
}) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});
  const [availabilities, setAvailabilities] = useState([])
  useEffect(() => {
    const getAvailabilities = async () => {
      const response = await getUserEventAvailabilities(url);
      
      if (response.success){
        const availabilitiesObj = response.data.reduce((acc: Record<number, number[]>, current: AvailabilityProps) => {
          acc[current.user_id] = acc[current.user_id] || [];
          if(current.time_slot_id)
            acc[current.user_id].push(current.time_slot_id)
          return acc;
        }, {})
        setAvailabilities(availabilitiesObj)
      }
        
      else console.warn(response.message);
    };
    getAvailabilities();
  }, []);
  
  useEffect(() => {
    setTsMap(prepareTimeSlots(timeSlots));
  }, [timeSlots]);

  console.log(availabilities)

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
