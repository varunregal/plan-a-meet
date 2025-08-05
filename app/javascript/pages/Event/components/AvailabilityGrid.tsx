import { useMemo, memo } from "react";
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
  const { selectedSlots, isEditMode, setHoveredSlotId } = useEventStore();

  const grid = useGridData(timeSlots);
  const { handleMouseDown, handleMouseEnter } = useDragSelection(
    selectedSlots,
    onSlotClick,
  );

  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollByAmount } =
    useScrollControls(400, [grid.dates.length]);

  const contextValue = useMemo(
    () => ({
      availabilityData: isEditMode ? {} : availabilityData,
      getSlot: grid.getSlot,
      handleSlotInteraction: {
        onMouseDown: handleMouseDown,
        onMouseEnter: (slotId: number, key: string) => {
          setHoveredSlotId(slotId);
          handleMouseEnter(slotId);
        },
        onMouseLeave: () => {
          setHoveredSlotId(null);
        },
      },
    }),
    [
      availabilityData,
      grid.getSlot,
      handleMouseDown,
      handleMouseEnter,
      isEditMode,
      setHoveredSlotId,
    ],
  );

  return (
    <GridContext.Provider value={contextValue}>
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
