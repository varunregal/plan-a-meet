import React, { useMemo } from "react";
import { TimeSlotProps } from "../event.types";
import { Button } from "@/components/ui/button";

export function AvailabilityGrid({
  timeSlots,
  selectedSlots,
}: {
  timeSlots: TimeSlotProps[];
  selectedSlots: Set<number>;
  onSlotClick: (slotId: number) => void;
  showGroupAvailability: boolean;
}) {
  const grid = useMemo(() => {
    const dates = new Set<string>();
    const hours = new Set<number>();
    const slotMap = new Map<string, TimeSlotProps>();

    timeSlots.forEach((slot) => {
      const startDate = new Date(slot.start_time);
      const dateStr = startDate.toDateString();
      const hour = startDate.getHours();
      const minute = startDate.getMinutes();

      dates.add(dateStr);
      hours.add(hour);
      const key = `${dateStr}-${hour}-${minute}`;
      slotMap.set(key, slot);
    });
    return {
      dates: Array.from(dates).sort(),
      hours: Array.from(hours).sort((a, b) => a - b),
      getSlot: (date: string, hour: number, minute: number = 0) => {
        const key = `${date}-${hour}-${minute}`;
        return slotMap.get(key) || null;
      },
    };
  }, [timeSlots]);

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour || 12;
    return `${displayHour}:00 ${period}`;
  };
  return (
    <div className="rounded-xl overflow-hidden bg-gray-50 p-0.5">
      <div
        className="grid bg-white rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `80px repeat(${grid.dates.length}, 1fr)`,
        }}
      >
        <div className="bg-gray-50 rounded-tl-lg"></div>
        {grid.dates.map((dateStr, idx) => {
          const date = new Date(dateStr);
          const isLast = idx === grid.dates.length - 1;
          return (
            <div
              key={idx}
              className={`bg-gray-50 p-4 text-center ${isLast ? "rounded-tr-lg" : ""}`}
            >
              <div className="font-semibold text-sm text-gray-900">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}

        {grid.hours.map((hour, hourIdx) => {
          const isLastRow = hourIdx === grid.hours.length - 1;
          return (
            <React.Fragment key={hour}>
              <div
                className={`bg-gray-50 px-3 py-1 text-right text-sm text-gray-700 font-medium ${isLastRow ? "rounded-bl-lg" : ""}`}
              >
                {formatHour(hour)}
              </div>

              {grid.dates.map((date, dateIdx) => {
                const isLastCol = dateIdx === grid.dates.length - 1;
                return (
                  <div
                    key={`${date}-${hour}`}
                    className={`px-2 py-1 ${
                      isLastRow && isLastCol ? "rounded-br-lg" : ""
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {[0, 15, 30, 45].map((minute) => {
                        const slot = grid.getSlot(date, hour, minute);
                        const isSelected = slot && selectedSlots.has(slot.id);

                        return (
                          <Button
                            key={`${date}-${hour}-${minute}`}
                            disabled={!slot}
                            className={`
                                relative p-0 h-4 rounded-md transition-all duration-150 text-xs
                                ${
                                  slot
                                    ? isSelected
                                      ? "bg-primary opacity-70 text-white border border-purple-300"
                                      : "bg-gray-50 hover:bg-purple-50 hover:border-purple-400 border border-gray-100 active:scale-95"
                                    : "bg-gray-100 cursor-not-allowed opacity-40"
                                }
                                focus:outline-none focus:ring-purple-500
                              `}
                            onClick={() => slot && handleSlotClick(slot.id)}
                          >
                            {isSelected && "✓"}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
