import { useMemo, memo, useCallback } from "react";
import { TimeSlotProps } from "../event.types";
import { DayColumn } from "./DayColumn";
import { TimeColumn } from "./TimeColumn";
import { GridContext } from "../contexts/GridContext";
import { useDragSelection } from "../hooks/useDragSelection";
import { useGridData } from "../hooks/useGridData";
import { useScrollControls } from "../hooks/useScrollControls";
import { formatHour } from "../utils/dateFormatters";
import { useEventStore } from "@/stores/eventStore";
import { ScrollControls } from "./ScrollControls";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

interface AvailabilityGridProps {
  timeSlots: TimeSlotProps[];
  onSlotClick: (slotId: number) => void;
  availabilityData?: { [key: string]: string[] };
}

function ToolTipSlot() {
  const { hoveredSlotData } = useEventStore();
  console.log("triggered", hoveredSlotData);
  if (!hoveredSlotData.id) return null;
  return (
    <Tooltip open={true}>
      <TooltipContent>
        <p>{hoveredSlotData?.timeRange}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function AvailabilityGridComponent({
  timeSlots,
  onSlotClick,
  availabilityData = {},
}: AvailabilityGridProps) {
  const { selectedSlots, isEditMode, setHoveredSlotData } = useEventStore();

  const grid = useGridData(timeSlots);
  const { handleMouseDown, handleMouseEnter } = useDragSelection(
    selectedSlots,
    onSlotClick,
  );

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollByAmount } =
    useScrollControls(400, [grid.dates.length]);
  const handleSlotMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      const slotId = Number(e.currentTarget.getAttribute("data-slot-id"));
      const timeRange = e.currentTarget.getAttribute("data-time-range") || "";
      if (!isNaN(slotId)) {
        setHoveredSlotData({ id: slotId, timeRange });
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
    setHoveredSlotData({ id: null, timeRange: "" });
  }, [setHoveredSlotData]);

  return (
    // <GridContext.Provider value={contextValue}>
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
    // <ToolTipSlot />
    // </GridContext.Provider>
  );
}

export const AvailabilityGrid = memo(AvailabilityGridComponent);
