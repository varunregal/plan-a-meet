import React from "react";

interface TimeSlotProps {
  hour: number;
  minute: number;
  isSelected: boolean;
  isHovered: boolean;
  availabilityCount: number;
  showGroupAvailability: boolean;
  opacity: string;
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
  showGroupAvailability,
  opacity,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: TimeSlotProps) {
  // Format time range for tooltip
  const startTime = `${hour}:${minute.toString().padStart(2, "0")}`;
  const endHour = minute === 45 ? hour + 1 : hour;
  const endMinute = minute === 45 ? 0 : minute + 15;
  const endTime = `${endHour}:${endMinute.toString().padStart(2, "0")}`;

  return (
    <div className="relative group">
      <button
        className={`
          w-full h-full transition-all duration-150 relative border
          ${
            isSelected
              ? "bg-primary"
              : showGroupAvailability && availabilityCount > 0
                ? "bg-primary"
                : "bg-white"
          }
          ${
            isHovered
              ? isSelected
                ? "border-dashed border-white"
                : "border-dashed border-gray-400"
              : "border-transparent"
          }
        `}
        style={{
          opacity: isSelected
            ? 0.7
            : showGroupAvailability && availabilityCount > 0
              ? opacity
              : 1,
        }}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Show count on hover with white text for selected */}
        {isHovered &&
          (showGroupAvailability ? availabilityCount > 0 : true) && (
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
                isSelected ? "text-white" : "text-gray-700"
              }`}
            >
              {showGroupAvailability ? availabilityCount : ""}
            </span>
          )}
      </button>

      {/* Tooltip showing time range */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
          <div className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap shadow-lg">
            {startTime} - {endTime}
            {showGroupAvailability && availabilityCount > 0 && (
              <div className="text-[10px] text-gray-300 mt-0.5">
                {availabilityCount}{" "}
                {availabilityCount === 1 ? "person" : "people"} available
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
