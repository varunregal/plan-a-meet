import { TimeSlotProps } from "@/pages/Event/event.types";
import { useEffect, useState } from "react";
import TimeSlot from "./TimeSlot";
import { format } from "date-fns";
import prepareTimeSlots from "@/lib/prepareTimeSlots";

function AvailabilityGrid({
  eventTimeSlots,
  color,
  handleTimeSlotClick,
  setHoveredTimeSlot,
}: {
  eventTimeSlots: TimeSlotProps[];
  color: (id: number) => string;
  handleTimeSlotClick?: (slot: number) => void;
  setHoveredTimeSlot?: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [tsMap, setTsMap] = useState<Record<string, TimeSlotProps[]>>({});

  useEffect(() => {
    setTsMap(prepareTimeSlots(eventTimeSlots));
  }, [eventTimeSlots]);

  return (
    <div className="flex gap-2 max-w-full overflow-x-auto pl-20 pb-2 scrollbar-visible">
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
                  color={color(slot.id)}
                  key={slot.id}
                  column={index}
                  onClick={handleTimeSlotClick}
                  setHoveredTimeSlot={setHoveredTimeSlot}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default AvailabilityGrid;
