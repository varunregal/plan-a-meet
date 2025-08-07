import { memo } from "react";
import { cn } from "@/lib/utils";
import { AVAILABILITY_STYLES } from "../constants/grid.constants";

interface TimeSlotProps {
  slotId: number;
  hour: number;
  minute: number;
  isSelected: boolean;
  percentage: number;
}

const BASE_CLASSES =
  "w-full h-full transition-all duration-150 relative cursor-pointer";

function getAvailabilityStyle(percentage: number) {
  const style = AVAILABILITY_STYLES.find(
    ({ min, max }) => percentage >= min && percentage <= max,
  );
  return style?.classes || AVAILABILITY_STYLES[0].classes;
}

function TimeSlot({
  slotId,
  hour,
  minute,
  isSelected,
  percentage,
}: TimeSlotProps) {
  return (
    <button
      data-slot-id={slotId}
      data-is-selected={isSelected}
      className={cn(
        BASE_CLASSES,
        "hover:[border:1px_dashed_theme(colors.gray.600)] hover:z-10 hover:shadow-lg",
        isSelected && "bg-[#6e56cf]/90",
        getAvailabilityStyle(percentage),
        percentage > 60 && "hover:[border:1px_dashed_theme(colors.gray.100)]",
      )}
      aria-label={`${hour}:${minute.toString().padStart(2, "0")}`}
    />
  );
}

export default memo(TimeSlot);
