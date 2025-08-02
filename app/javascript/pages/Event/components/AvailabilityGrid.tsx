import { useState, useMemo, memo } from "react";
import { TimeSlotProps } from "../event.types";
import { DayColumn } from "./DayColumn";
import { TimeColumn } from "./TimeColumn";
import { GridContext } from "../contexts/GridContext";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import { formatHour } from "../utils/dateFormatters";
import { useEventStore } from "@/stores/eventStore";

interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
  onSlotClick: (slotId: number) => void;
  availabilityData?: { [key: string]: string[] };
}

function AvailabilityGridComponent({
  timeSlots,
  onSlotClick,
  availabilityData = {},
}: AvailabilityGridProps) {
  const selectedSlots = useEventStore((state) => state.selectedSlots);
  const isEditMode = useEventStore((state) => state.isEditMode);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const grid = useGridData(timeSlots);
  const { handleMouseDown, handleMouseEnter } = useDragSelection(
    selectedSlots,
    onSlotClick,
  );

  const contextValue = useMemo(
    () => ({
      hoveredSlot,
      availabilityData: isEditMode ? {} : availabilityData,
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
      hoveredSlot,
      availabilityData,
      grid.getSlot,
      handleMouseDown,
      handleMouseEnter,
    ],
  );
  return (
    <GridContext.Provider value={contextValue}>
      <div className="h-full flex flex-col">
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
      </div>
    </GridContext.Provider>
  );
}

export const AvailabilityGrid = memo(AvailabilityGridComponent);
