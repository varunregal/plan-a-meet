import { memo, useCallback, useEffect, useState } from "react";
import { TimeSlotProps } from "../event.types";
import { CalendarImportButtons } from "./CalendarImportButtons";
import { AvailabilityControls } from "./AvailabilityControls";
import { CalendarImportHeader } from "./CalendarImportHeader";
import { AvailabilitySection } from "./AvailabilitySection";
import { useAvailabilitySelection } from "../hooks/useAvailabilitySelection";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";
import api from "@/lib/api";
import { toast } from "sonner";

interface CalendarImportSectionProps {
  timeSlots: TimeSlotProps[];
  availabilityData?: { [key: string]: string[] };
  onSelectionChange?: (selectedSlots: Set<number>) => void;
  onImportCalendar?: (provider: "google" | "outlook") => void;
  eventUrl: string;
  currentUserSlots?: number[];
}

function CalendarImportSectionComponent({
  timeSlots,
  availabilityData,
  onSelectionChange,
  currentUserSlots,
  onImportCalendar,
  eventUrl,
}: CalendarImportSectionProps) {
  const [hasUnSavedChanges, setHasUnSavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    selectedSlots,
    showGroupAvailability,
    handleSlotClick,
    clearSelection,
    toggleGroupAvailability,
    hasSelection,
    setSelectedSlots,
  } = useAvailabilitySelection();
  useEffect(() => {
    if (currentUserSlots && currentUserSlots.length > 1) {
      setSelectedSlots(new Set(currentUserSlots));
    }
  }, [currentUserSlots, setSelectedSlots]);
  const handleSlotClickWithCallback = useCallback(
    (slotId: number) => {
      handleSlotClick(slotId);
      setHasUnSavedChanges(true);

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

  const handleClearSelection = useCallback(() => {
    clearSelection();
    setHasUnSavedChanges(true);
  }, [clearSelection]);

  const handleSelectBestTimes = useCallback(() => {
    // TODO: Implement smart selection based on group availability
    console.log("Select best times - to be implemented");
  }, []);

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    try {
      await api.post(`/events/${eventUrl}/availabilities`, {
        time_slot_ids: Array.from(selectedSlots),
      });
      setHasUnSavedChanges(false);
      toast.success("Availability saved successfully!");
    } catch (error) {
      console.error("Failed to save availability", error);
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={AVAILABILITY_CONSTANTS.CONTAINER_CLASSES}>
      <CalendarImportHeader />

      <CalendarImportButtons onImport={onImportCalendar} />

      <div className={AVAILABILITY_CONSTANTS.DIVIDER_CLASSES} />

      <AvailabilityControls
        showGroupAvailability={showGroupAvailability}
        onToggleGroupAvailability={toggleGroupAvailability}
        onSelectBestTimes={handleSelectBestTimes}
        onClearSelection={handleClearSelection}
        hasSelection={hasSelection}
      />

      <AvailabilitySection
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        onSlotClick={handleSlotClickWithCallback}
        showGroupAvailability={showGroupAvailability}
        availabilityData={availabilityData}
      />
      {hasUnSavedChanges && (
        <div className="sticky z-10 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-600 font-medium">
              You have unsaved changes
            </span>
            <button
              onClick={handleSaveAvailability}
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CalendarImportSectionComponent);
