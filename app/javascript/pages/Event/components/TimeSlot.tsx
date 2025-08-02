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
  // console.log(availabilityCount, totalParticipants);
  const totalParticipants = useEventStore((state) => state.totalParticipants);
  // Format time range for tooltip
  const startTime = `${hour}:${minute.toString().padStart(2, "0")}`;
  const endHour = minute === 45 ? hour + 1 : hour;
  const endMinute = minute === 45 ? 0 : minute + 15;
  const endTime = `${endHour}:${endMinute.toString().padStart(2, "0")}`;

  // Calculate percentage
  const percentage =
    totalParticipants > 0
      ? Math.round((availabilityCount / totalParticipants) * 100)
      : 0;

  // Determine slot styling based on percentage
  const getSlotClasses = () => {
    let baseClasses = "w-full h-full transition-all duration-150 relative";

    // Heat map colors based on percentage
    if (percentage === 0) {
      baseClasses += " bg-gray-50 text-gray-500 border-gray-200";
    } else if (percentage <= 25) {
      baseClasses += " bg-green-50 text-green-700 border-green-200";
    } else if (percentage <= 50) {
      baseClasses += " bg-green-100 text-green-800 border-green-300";
    } else if (percentage <= 75) {
      baseClasses += " bg-green-200 text-green-900 border-green-400";
    } else if (percentage < 100) {
      baseClasses += " bg-green-300 text-green-900 border-green-500";
    } else {
      // 100% - Everyone available
      baseClasses += " bg-green-600 text-white border-green-700 font-semibold";
    }

    // Add purple ring for user selection
    if (isSelected) {
      baseClasses += " ring-1 ring-purple-500 ring-inset";
    }

    // Hover state
    if (isHovered) {
      baseClasses += " z-10 shadow-md";
    }

    return baseClasses;
  };

  // Slot content
  const getSlotContent = () => {
    if (availabilityCount === 0 && !isSelected) {
      return <span className="text-sm"></span>;
    }

    return <span className="text-sm font-medium"></span>;
  };

  // Tooltip content
  const getTooltipContent = () => {
    const baseInfo = `${startTime} - ${endTime}`;

    if (availabilityCount === 0 && !isSelected) {
      return `${baseInfo}\nNo responses`;
    }

    let availabilityInfo = `${availabilityCount} of ${totalParticipants} available`;
    if (isSelected) {
      availabilityInfo += " (including you)";
    }

    if (percentage === 100) {
      return `${baseInfo}\nEveryone is available!`;
    }

    return `${baseInfo}\n${availabilityInfo}`;
  };

  return (
    <div className="relative group">
      <button
        className={getSlotClasses()}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={getTooltipContent().replace("\n", " - ")}
      >
        {getSlotContent()}
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
          <div className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs whitespace-pre-line shadow-lg">
            {getTooltipContent()}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
