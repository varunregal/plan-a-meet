import { useEventStore } from "@/stores/eventStore";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimeSlotProps {
  hour: number;
  minute: number;
  slotId: number;
  isSelected: boolean;
  isHovered: boolean;
  availabilityCount: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const BASE_CLASSES = "w-full h-full transition-all duration-150 relative";

const AVAILABILITY_STYLES = [
  { min: 0, max: 0, classes: "text-gray-500 border-gray-200" },
  {
    min: 1,
    max: 25,
    classes: "bg-[#6e56cf]/20 border-[#6e56cf]/20",
  },
  {
    min: 26,
    max: 50,
    classes: "bg-[#6e56cf]/40 border-[#6e56cf]/30",
  },
  {
    min: 51,
    max: 75,
    classes: "bg-[#6e56cf]/50 border-[#6e56cf]/50",
  },
  {
    min: 76,
    max: 99,
    classes: "bg-[#6e56cf]/60 border-[#6e56cf]/70",
  },
  {
    min: 100,
    max: 100,
    classes: "bg-[#6e56cf]/90 border-[#6e56cf]",
  },
];

function formatTimeRange(hour: number, minute: number) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const startTime = `${hour}:${pad(minute)}`;
  const endHour = minute === 45 ? hour + 1 : hour;
  const endMinute = minute === 45 ? 0 : minute + 15;
  const endTime = `${endHour}:${pad(endMinute)}`;
  return `${startTime} - ${endTime}`;
}

function getAvailabilityStyle(percentage: number) {
  const style = AVAILABILITY_STYLES.find(
    ({ min, max }) => percentage >= min && percentage <= max,
  );
  return style?.classes || AVAILABILITY_STYLES[0].classes;
}

export function TimeSlot({
  hour,
  minute,
  slotId,
  isSelected,
  isHovered,
  availabilityCount,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: TimeSlotProps) {
  const {
    isEditMode,
    incrementViewModeClick,
    totalParticipants,
    hoveredParticipantId,
    participants,
  } = useEventStore();
  const isHoveredParticipantSlot =
    hoveredParticipantId &&
    participants
      .find((p) => p.id === hoveredParticipantId)
      ?.slot_ids.includes(slotId);

  const percentage =
    totalParticipants > 0
      ? Math.round((availabilityCount / totalParticipants) * 100)
      : 0;
  const timeRange = formatTimeRange(hour, minute);
  const availabilityStyle = getAvailabilityStyle(percentage);
  const buttonClasses = [
    BASE_CLASSES,
    availabilityStyle,
    isSelected &&
      isEditMode &&
      "bg-primary/90 text-white border-primary font-semibold",
    isHovered && "z-10 shadow-lg border border-gray-400 border-dashed",
    isHoveredParticipantSlot && "z-20 border-2 border-orange-300",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) {
      e.preventDefault();
      incrementViewModeClick();
      return;
    }
    onMouseDown(e);
  };
  return (
    <Tooltip open={isHovered}>
      <TooltipTrigger asChild>
        <div className="relative group">
          <button
            className={buttonClasses}
            onMouseDown={handleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            aria-label={timeRange}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-800 fill-gray-800 text-white">
        <p>{timeRange}</p>
      </TooltipContent>
    </Tooltip>
  );
}
