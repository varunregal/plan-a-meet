import { format, parseISO } from "date-fns";
import { TimeSlotProps } from "../../Event/event.types";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import { CheckIcon } from "lucide-react";

function TimeSlot({
  slot,
  column,
  onClick,
  setHoveredTimeSlot,
  color,
}: {
  slot: TimeSlotProps;
  column: number;
  onClick: any;
  setHoveredTimeSlot?: React.Dispatch<React.SetStateAction<number | null>>;
  color: string;
}) {
  const { scheduledTimeSlots, groupTimeSlots } = useAvailabilityContext();
  const isHour =
    (new Date(slot.start_time).getHours() * 60 +
      new Date(slot.start_time).getMinutes()) %
      60 ===
    0;
  const isScheduleSlots = window.location.pathname.includes("/scheduled_slots");
  const checkSlotInScheduledSlots = (slot: number) =>
    scheduledTimeSlots.some((item: number) => item === slot);
  const checkSlotInGroupTime = (slot: number) =>
    (groupTimeSlots[slot] || []).length;
  return (
    <div className="relative">
      <div
        className={`w-20 h-7 hover:border-2 hover:border-purple-500 flex justify-center items-center`}
        style={{ backgroundColor: color }}
        onClick={() => onClick(slot.id)}
        onMouseEnter={
          setHoveredTimeSlot ? () => setHoveredTimeSlot(slot.id) : () => {}
        }
        onMouseLeave={
          setHoveredTimeSlot ? () => setHoveredTimeSlot(null) : () => {}
        }
      >
        {isScheduleSlots && checkSlotInScheduledSlots(slot.id) && (
          <CheckIcon
            className={`w-4 h-4 ${
              checkSlotInGroupTime(slot.id) ? "text-white" : "text-gray-900"
            } stroke-4`}
          />
        )}
      </div>

      {isHour && column === 0 && (
        <div className="absolute -left-20 -top-1 text-sm font-medium">
          {format(parseISO(slot.start_time), "h:mm a")}
        </div>
      )}
    </div>
  );
}
export default TimeSlot;
