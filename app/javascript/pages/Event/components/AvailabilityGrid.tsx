import { TimeSlotProps } from "../event.types";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import TimeSlot from "./TimeSlot";
import { useCallback, useEffect, useRef, useState } from "react";

const MINUTE_INTERVALS: number[] = [0, 15, 30, 45];
interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
}

function AvailabilityGrid({ timeSlots }: AvailabilityGridProps) {
  const { hours, dates, getSlot } = useGridData({ timeSlots });
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const selectedRef = useRef(selected);
  const toggleSlot = useCallback((slotId: number) => {
    setSelected((prev) => {
      const newSet = new Set<number>(prev);
      if (newSet.has(slotId)) {
        newSet.delete(slotId);
      } else {
        newSet.add(slotId);
      }
      return newSet;
    });
  }, []);

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragSelection({
      selectedRef,
      toggleSlot,
    });

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  return (
    <div
      className="flex gap-1"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {dates.map((date) => (
        <div className="flex flex-col" key={date}>
          {date}
          {hours.map((hour) => (
            <div className="flex flex-col" key={`${date}-${hour}`}>
              {MINUTE_INTERVALS.map((minute) => {
                const slotId = getSlot(`${date}-${hour}-${minute}`);
                return (
                  <TimeSlot
                    key={`${date}-${hour}-${minute}`}
                    slotId={slotId}
                    minute={minute}
                    isSelected={selected.has(slotId)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AvailabilityGrid;
