import { memo } from "react";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  slotId: number;
  hour: number;
  minute: number;
  isSelected: boolean;
}

const BASE_CLASSES = "w-full h-full transition-all duration-150 relative cursor-pointer";

function TimeSlot({
  slotId,
  hour,
  minute,
  isSelected,
}: TimeSlotProps) {
  return (
    <button
      data-slot-id={slotId}
      data-is-selected={isSelected}
      className={cn(
        BASE_CLASSES,
        "hover:bg-gray-100",
        isSelected && "bg-[#6e56cf]/90 hover:bg-[#6e56cf] text-white"
      )}
      aria-label={`${hour}:${minute.toString().padStart(2, "0")}`}
    />
  );
}

export default memo(TimeSlot);