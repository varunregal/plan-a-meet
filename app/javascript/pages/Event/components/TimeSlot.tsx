import { useEventStore } from "@/stores/eventStore";
import React from "react";

interface TimeSlotProps {
  hour: number;
  minute: number;
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
  { min: 1, max: 25, classes: "bg-primary/10 text-primary border-primary/20" },
  { min: 26, max: 50, classes: "bg-primary/20 text-primary border-primary/30" },
  { min: 51, max: 75, classes: "bg-primary/40 text-primary border-primary/50" },
  { min: 76, max: 99, classes: "bg-primary/60 text-white border-primary/70" },
  {
    min: 100,
    max: 100,
    classes: "bg-primary/90 text-white border-primary font-semibold",
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

function Tooltip({ timeRange }: { timeRange: string }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
      <div className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs whitespace-pre-line shadow-lg">
        {timeRange}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
        <div className="w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}

export function TimeSlot({
  hour,
  minute,
  isSelected,
  isHovered,
  availabilityCount,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: TimeSlotProps) {
  const totalParticipants = useEventStore((state) => state.totalParticipants);

  const percentage =
    totalParticipants > 0
      ? Math.round((availabilityCount / totalParticipants) * 100)
      : 0;
  const timeRange = formatTimeRange(hour, minute);
  const availabilityStyle = getAvailabilityStyle(percentage);
  const buttonClasses = [
    BASE_CLASSES,
    availabilityStyle,
    isSelected && "ring-[2px] ring-orange-300 ring-inset",
    isHovered && "z-10 shadow-lg border border-gray-400 border-dashed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative group">
      <button
        className={buttonClasses}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={timeRange}
      ></button>

      {isHovered && <Tooltip timeRange={timeRange} />}
    </div>
  );
}
