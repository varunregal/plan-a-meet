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
  setHoveredTimeSlot?: React.Dispatch<React.SetStateAction<number | null>>;
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
        className={`w-50 h-7 hover:border-2 hover:border-purple-500`}
        style={{ backgroundColor: color }}
        onClick={() => onClick(slot.id)}
        onMouseEnter={
          setHoveredTimeSlot ? () => setHoveredTimeSlot(slot.id) : () => {}
        }
        onMouseLeave={
          setHoveredTimeSlot ? () => setHoveredTimeSlot(null) : () => {}
        }
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
