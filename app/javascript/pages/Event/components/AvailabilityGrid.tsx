import { memo, useCallback } from "react";
import { TimeSlotProps } from "../event.types";
import { DayColumn } from "./DayColumn";
import { TimeColumn } from "./TimeColumn";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import { useScrollControls } from "../hooks/useScrollControls";
import { formatHour } from "../utils/dateFormatters";
import { useEventStore } from "@/stores/eventStore";
import { ScrollControls } from "./ScrollControls";

interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
  availabilityData?: { [key: string]: string[] };
}

function AvailabilityGrid({
  timeSlots,
  availabilityData = {},
}: AvailabilityGridProps) {
  const isEditMode = useEventStore((state) => state.isEditMode);
  const setHoveredSlotData = useEventStore((state) => state.setHoveredSlotData);
  const toggleSlot = useEventStore((state) => state.toggleSlot);
  const selectedSlots = useEventStore((state) => state.selectedSlots);
  const grid = useGridData(timeSlots);
  const { handleMouseDown, handleMouseEnter } = useDragSelection(
    selectedSlots,
    toggleSlot,
  );

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollByAmount } =
    useScrollControls(400, [grid.dates.length]);
  const handleSlotMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      const slotId = Number(e.currentTarget.getAttribute("data-slot-id"));
      if (!isNaN(slotId)) {
        setHoveredSlotData({ id: slotId });
        handleMouseEnter(slotId);
      }
    },
    [setHoveredSlotData, handleMouseEnter],
  );

  const handleSlotMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const slotId = Number(e.currentTarget.getAttribute("data-slot-id"));
      const isSelected =
        e.currentTarget.getAttribute("data-is-selected") === "true";
      if (!isNaN(slotId)) {
        handleMouseDown(e, slotId, isSelected);
      }
    },
    [handleMouseDown],
  );

  const handleSlotMouseLeave = useCallback(() => {
    setHoveredSlotData({ id: null });
  }, [setHoveredSlotData]);

  return (
    <div className="h-full flex flex-col">
      <ScrollControls
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        onScrollLeft={() => scrollByAmount("left")}
        onScrollRight={() => scrollByAmount("right")}
      />

      <div className="border border-gray-200 rounded-lg flex flex-1 overflow-hidden">
        <TimeColumn hours={grid.hours} formatHour={formatHour} />

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden flex-1"
        >
          <div className="flex h-full min-w-fit">
            {grid.dates.map((dateStr) => (
              <DayColumn
                key={dateStr}
                dateStr={dateStr}
                getSlot={grid.getSlot}
                hours={grid.hours}
                availabilityData={isEditMode ? {} : availabilityData}
                handleSlotInteraction={{
                  onMouseDown: handleSlotMouseDown,
                  onMouseEnter: handleSlotMouseEnter,
                  onMouseLeave: handleSlotMouseLeave,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityGrid;
