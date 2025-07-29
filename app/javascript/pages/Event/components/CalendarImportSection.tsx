import { memo, useCallback } from "react";
import { TimeSlotProps } from "../event.types";
import { CalendarImportButtons } from "./CalendarImportButtons";
import { AvailabilityControls } from "./AvailabilityControls";
import { CalendarImportHeader } from "./CalendarImportHeader";
import { AvailabilitySection } from "./AvailabilitySection";
import { useAvailabilitySelection } from "../hooks/useAvailabilitySelection";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";

interface CalendarImportSectionProps {
  timeSlots: TimeSlotProps[];
  availabilityData?: { [key: string]: string[] };
  onSelectionChange?: (selectedSlots: Set<number>) => void;
  onImportCalendar?: (provider: "google" | "outlook") => void;
}

function CalendarImportSectionComponent({
  timeSlots,
  availabilityData,
  onSelectionChange,
  onImportCalendar,
}: CalendarImportSectionProps) {
  const {
    selectedSlots,
    showGroupAvailability,
    handleSlotClick,
    clearSelection,
    toggleGroupAvailability,
    hasSelection,
  } = useAvailabilitySelection();

  const handleSlotClickWithCallback = useCallback(
    (slotId: number) => {
      handleSlotClick(slotId);
      if (onSelectionChange) {
        const newSet = new Set(selectedSlots);
        if (newSet.has(slotId)) {
          newSet.delete(slotId);
        } else {
          newSet.add(slotId);
        }
        onSelectionChange(newSet);
      }
    },
    [handleSlotClick, selectedSlots, onSelectionChange],
  );

  const handleSelectBestTimes = useCallback(() => {
    // TODO: Implement smart selection based on group availability
    console.log("Select best times - to be implemented");
  }, []);

  return (
    <div className={AVAILABILITY_CONSTANTS.CONTAINER_CLASSES}>
      <CalendarImportHeader />

      <CalendarImportButtons onImport={onImportCalendar} />

      <div className={AVAILABILITY_CONSTANTS.DIVIDER_CLASSES} />

      <AvailabilityControls
        showGroupAvailability={showGroupAvailability}
        onToggleGroupAvailability={toggleGroupAvailability}
        onSelectBestTimes={handleSelectBestTimes}
        onClearSelection={clearSelection}
        hasSelection={hasSelection}
      />

      <AvailabilitySection
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        onSlotClick={handleSlotClickWithCallback}
        showGroupAvailability={showGroupAvailability}
        availabilityData={availabilityData}
      />
    </div>
  );
}

export default memo(CalendarImportSectionComponent);
