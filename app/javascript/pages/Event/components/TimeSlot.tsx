import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { memo } from "react";

function TimeSlot({
  slotId,
  minute,
  isSelected,
  // onPointerMove,
  // onPointerDown,
}: {
  slotId: number;
  minute: number;
  isSelected: boolean;
  // onPointerMove: (e: React.MouseEvent, slotId: number) => void;
  // onPointerDown: (e: React.MouseEvent, slotId: number) => void;
}) {
  return (
    <div className="">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            data-slot-id={slotId}
            // onMouseDown={(e) => onPointerDown(e, slotId)}
            // onMouseEnter={(e) => onPointerMove(e, slotId)}
            className={`w-[150px] h-5 border-1  ${isSelected ? "border-orange-400" : "border-gray-300"}`}
          >
            {minute}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{slotId}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default memo(TimeSlot);
