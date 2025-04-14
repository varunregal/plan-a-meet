import { TimeSlotProps } from "../event.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TimeSlot({ slot }: { slot: TimeSlotProps }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`w-15 h-3 bg-gray-300 border-gray-300`}></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{slot.start_time}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  // return <div className={`w-15 h-3 bg-gray-300 border-gray-300`}></div>;
}
export default TimeSlot;
