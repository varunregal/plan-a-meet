import { formatTimeRange, TimeSlot } from "./TimeSlot";
import { useGridContext } from "../contexts/GridContext";
import { useEventStore } from "@/stores/eventStore";
import { TimeSlotProps } from "../event.types";

interface DayColumnProps {
  dateStr: string;
  hours: number[];
  availabilityData: { [key: string]: string[] };
  getSlot: (date: string, hour: number, minute: number) => TimeSlotProps | null;
  handleSlotInteraction: {
    onMouseDown: (
      e: React.MouseEvent,
      slotId: number,
      isSelected: boolean,
    ) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
  };
}

export function DayColumn({
  dateStr,
  hours,
  availabilityData,
  getSlot,
  handleSlotInteraction,
}: DayColumnProps) {
  const { selectedSlots, hoveredSlotId } = useEventStore();
  const date = new Date(dateStr);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.getDate();
  const monthName = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <div className="min-w-[150px] border-r border-gray-200 last:border-r-0">
      <div className="h-16 font-semibold border-b border-gray-200 flex flex-col items-center justify-center">
        <div className="text-xs text-gray-500">{dayName}</div>
        <div className="text-sm text-gray-900">
          {monthName} {dayNum}
        </div>
      </div>

      {hours.map((hour) => {
        const hourSlots = [0, 15, 30, 45].map((minute) => ({
          minute,
          slot: getSlot(dateStr, hour, minute),
          key: `${dateStr}-${hour}-${minute}`,
        }));

        return (
          <div key={hour} className="h-20 border-b border-gray-200">
            <div className="grid grid-cols-1 grid-rows-4 h-full relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] border-t border-dashed border-gray-300 pointer-events-none z-10" />

              {hourSlots.map(({ minute, slot, key }) => {
                if (!slot) return <div key={minute} />;

                const isSelected = selectedSlots.has(slot.id);
                const availability = availabilityData[key] || [];
                const count = availability.length;
                const isHovered = hoveredSlotId === slot.id;

                return (
                  <TimeSlot
                    key={minute}
                    hour={hour}
                    slotId={slot.id}
                    minute={minute}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    availabilityCount={count}
                    timeRange={formatTimeRange(hour, minute)}
                    onMouseDown={handleSlotInteraction.onMouseDown}
                    onMouseEnter={handleSlotInteraction.onMouseEnter}
                    onMouseLeave={handleSlotInteraction.onMouseLeave}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
