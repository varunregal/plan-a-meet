import { useState, useMemo, memo } from "react";
import { TimeSlotProps } from "../event.types";
import { DayColumn } from "./DayColumn";
import { TimeColumn } from "./TimeColumn";
import { AvailabilityGridHeader } from "./AvailabilityGridHeader";
import { AvailabilityLegend } from "./AvailabilityLegend";
import { GridContext } from "../contexts/GridContext";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import { formatHour } from "../utils/dateFormatters";
import { getAvailabilityStyle } from "../utils/availabilityHelpers";

interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
  selectedSlots: Set<number>;
  onSlotClick: (slotId: number) => void;
  showGroupAvailability: boolean;
  availabilityData?: { [key: string]: string[] };
}

function AvailabilityGridComponent({
  timeSlots,
  selectedSlots,
  onSlotClick,
  showGroupAvailability,
  availabilityData = {},
}: AvailabilityGridProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const grid = useGridData(timeSlots);
  const { handleMouseDown, handleMouseEnter } = useDragSelection(
    selectedSlots,
    onSlotClick,
  );

  const contextValue = useMemo(
    () => ({
      selectedSlots,
      hoveredSlot,
      showGroupAvailability,
      availabilityData,
      getAvailabilityStyle,
      getSlot: grid.getSlot,
      handleSlotInteraction: {
        onMouseDown: handleMouseDown,
        onMouseEnter: (slotId: number, key: string) => {
          setHoveredSlot(key);
          handleMouseEnter(slotId);
        },
        onMouseLeave: () => setHoveredSlot(null),
      },
    }),
    [
      selectedSlots,
      hoveredSlot,
      showGroupAvailability,
      availabilityData,
      grid.getSlot,
      handleMouseDown,
      handleMouseEnter,
    ],
  );
  return (
    <GridContext.Provider value={contextValue}>
      <div className="h-full flex flex-col">
        <AvailabilityGridHeader showGroupAvailability={showGroupAvailability} />

        <div className="border border-gray-200 rounded-lg overflow-hidden flex-1">
          <div className="flex h-full">
            <TimeColumn hours={grid.hours} formatHour={formatHour} />

            <div className="flex-1 flex">
              {grid.dates.map((dateStr) => (
                <DayColumn key={dateStr} dateStr={dateStr} hours={grid.hours} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start justify-between">
          <div className="text-sm text-gray-600">
            {selectedSlots.size} time slots selected
            {selectedSlots.size > 0 && (
              <button
                onClick={() => {
                  selectedSlots.forEach((slotId) => onSlotClick(slotId));
                }}
                className="ml-3 text-sm text-blue-600 hover:text-blue-700"
                type="button"
              >
                Clear selection
              </button>
            )}
          </div>

          {showGroupAvailability && <AvailabilityLegend />}
        </div>
      </div>
    </GridContext.Provider>
  );
}

export const AvailabilityGrid = memo(AvailabilityGridComponent);
