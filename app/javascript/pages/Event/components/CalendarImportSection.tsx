import { memo } from "react";
import { TimeSlotProps } from "../event.types";
import { CalendarImportButtons } from "./CalendarImportButtons";
import { CalendarImportHeader } from "./CalendarImportHeader";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";
import AvailabilityGrid from "./AvailabilityGrid";

interface CalendarImportSectionProps {
  timeSlots: TimeSlotProps[];
  availabilityData: { [key: string]: string[] };
  onImportCalendar?: (provider: "google" | "outlook") => void;
  onSaveAvailability: () => void;
  isSaving: boolean;
}

function CalendarImportSectionComponent({
  timeSlots,
  availabilityData,
  onImportCalendar,
  onSaveAvailability,
  isSaving,
}: CalendarImportSectionProps) {
  return (
    <div className={AVAILABILITY_CONSTANTS.CONTAINER_CLASSES}>
      <CalendarImportHeader onSave={onSaveAvailability} isSaving={isSaving} />
      <CalendarImportButtons onImport={onImportCalendar} />
      <div className={AVAILABILITY_CONSTANTS.DIVIDER_CLASSES} />

      <div className={AVAILABILITY_CONSTANTS.GRID_CONTAINER_CLASSES}>
        <AvailabilityGrid
          timeSlots={timeSlots}
          availabilityData={availabilityData}
        />
      </div>
    </div>
  );
}

export default CalendarImportSectionComponent;
