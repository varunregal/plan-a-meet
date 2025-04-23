import { format, parseISO } from "date-fns";
import { TimeSlotProps } from "../../Event/event.types";

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
  setHoveredTimeSlot?: any;
  color: string;
}) {
  const isHour =
    (new Date(slot.start_time).getHours() * 60 +
      new Date(slot.start_time).getMinutes()) %
      60 ===
    0;
  return (
    <div className="relative">
      <div
        className={`w-20 h-7`}
        style={{ backgroundColor: color }}
        onClick={() => onClick(slot.id)}
        onMouseEnter={() => setHoveredTimeSlot(slot.id)}
        onMouseLeave={() => setHoveredTimeSlot(null)}
      ></div>

      {isHour && column === 0 && (
        <div className="absolute -left-20 -top-1 text-sm font-medium">
          {format(parseISO(slot.start_time), "h:mm a")}
        </div>
      )}
    </div>
  );
}
export default TimeSlot;
