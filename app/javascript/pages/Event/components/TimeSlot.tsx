import { format } from "date-fns";
import { TimeSlotProps } from "../event.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TimeSlot({ slot }: { slot: TimeSlotProps }) {
  const isHour =
    (new Date(slot.start_time).getHours() * 60 +
      new Date(slot.start_time).getMinutes()) %
      60 ===
    0;

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`w-20 h-7 bg-gray-300 border-gray-300`}></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{slot.start_time}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isHour && (
        <div className="absolute -left-7 -top-1 text-sm font-medium">
          {format(slot.start_time, "H")}
        </div>
      )}
    </div>
  );
}
export default TimeSlot;
