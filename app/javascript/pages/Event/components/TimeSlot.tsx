import { format, parseISO } from "date-fns";
import { TimeSlotProps } from "../event.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// here the timezone in which the user is -- time will be displayed accordingly
function TimeSlot({
  slot,
  column,
  onClick,
  color
  // isUserSelected
}: {
  slot: TimeSlotProps;
  column: number;
  onClick: any;
  color: string
  // isUserSelected: boolean
}) {
  const isHour =
    (new Date(slot.start_time).getHours() * 60 +
      new Date(slot.start_time).getMinutes()) %
      60 ===
    0;
  // console.log(color, slot)
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`w-20 h-7`}
              style={{backgroundColor: color}}
              onClick={() => onClick(slot.id)}
            ></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{slot.start_time}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isHour && column === 0 && (
        <div className="absolute -left-7 -top-1 text-sm font-medium">
          {format(parseISO(slot.start_time), "H")}
        </div>
      )}
    </div>
  );
}
export default TimeSlot;
