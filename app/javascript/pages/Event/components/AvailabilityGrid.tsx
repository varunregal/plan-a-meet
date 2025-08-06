import { TimeSlotProps } from "../event.types";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import TimeSlot from "./TimeSlot";
import { useCallback, useEffect, useRef, useState } from "react";

const MINUTE_INTERVALS: number[] = [0, 15, 30, 45];
interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
}

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

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
    <div className="h-full flex flex-col">
      <div className="border border-gray-200 rounded-lg flex flex-1 overflow-hidden">
        <div className="w-20 border-r border-gray-200">
          <div className="h-16 border-b border-gray-200" />
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b border-gray-200 flex items-center justify-center"
            >
              <span className="text-sm text-gray-600 font-semibold">
                {formatHour(hour).replace(":00", "")}
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto overflow-y-hidden flex-1">
          <div
            className="flex h-full min-w-fit"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {dates.map((dateStr) => {
              const date = new Date(dateStr);
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const dayNum = date.getDate();
              const monthName = date.toLocaleDateString("en-US", {
                month: "short",
              });

              return (
                <div
                  key={dateStr}
                  className="min-w-[150px] border-r border-gray-200 last:border-r-0"
                >
                  <div className="h-16 font-semibold border-b border-gray-200 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500">{dayName}</div>
                    <div className="text-sm text-gray-900">
                      {monthName} {dayNum}
                    </div>
                  </div>

                  {hours.map((hour) => (
                    <div key={hour} className="h-20 border-b border-gray-200">
                      <div className="grid grid-cols-1 grid-rows-4 h-full relative">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] border-t border-dashed border-gray-300 pointer-events-none z-10" />

                        {MINUTE_INTERVALS.map((minute) => {
                          const slotId = getSlot(
                            `${dateStr}-${hour}-${minute}`,
                          );
                          if (!slotId) return <div key={minute} />;

                          return (
                            <TimeSlot
                              key={minute}
                              slotId={slotId}
                              hour={hour}
                              minute={minute}
                              isSelected={selected.has(slotId)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityGrid;
