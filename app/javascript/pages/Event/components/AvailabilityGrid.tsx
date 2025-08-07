import { useEventStore } from "@/stores/eventStore";
import { EventProps, TimeSlotProps } from "../event.types";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import { useSlotSelection } from "../hooks/useSlotSelection";
import { useFetchAvailability } from "../utils/useFetchAvailability";
import TimeSlot from "./TimeSlot";
import { useEffect } from "react";

const MINUTE_INTERVALS: number[] = [0, 15, 30, 45];
interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
  event: EventProps;
  currentUserId: string;
}

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

function AvailabilityGrid({
  timeSlots,
  event,
  currentUserId,
}: AvailabilityGridProps) {
  const setSelectedSlots = useEventStore((state) => state.setSelectedSlots);
  const isEditMode = useEventStore((state) => state.isEditMode);
  const { data, isLoading } = useFetchAvailability({
    event,
    currentUserId,
  });

  const {
    availability_data = [],
    current_user_slots = [],
    total_event_participants = 0,
    participants = [],
  } = data || {};
  const { hours, dates, getSlot } = useGridData({ timeSlots });
  const { selected, selectedRef, toggleSlot } = useSlotSelection({
    currentUserSlots: current_user_slots,
  });

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragSelection({
      selectedRef,
      toggleSlot,
    });

  useEffect(() => {
    selectedRef.current = selected;
    setSelectedSlots(selected);
  }, [selected, setSelectedSlots]);

  console.log({ selected, availability_data });
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
                          const key = `${dateStr}-${hour}-${minute}`;
                          const slotId = getSlot(key);

                          const availabilityCount = (
                            availability_data[key] || []
                          ).length;
                          const percentage =
                            total_event_participants > 0
                              ? Math.round(
                                  (availabilityCount /
                                    total_event_participants) *
                                    100,
                                )
                              : 0;
                          if (!slotId) return <div key={minute} />;

                          return (
                            <TimeSlot
                              key={minute}
                              slotId={slotId}
                              hour={hour}
                              minute={minute}
                              percentage={!isEditMode ? percentage : 0}
                              isSelected={selected.has(slotId)}
                              participants={participants}
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
