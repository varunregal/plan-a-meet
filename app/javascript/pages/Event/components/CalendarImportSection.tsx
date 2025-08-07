import { memo } from "react";
import { EventProps, TimeSlotProps } from "../event.types";
import { CalendarImportButtons } from "./CalendarImportButtons";
import { CalendarImportHeader } from "./CalendarImportHeader";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";
import AvailabilityGrid from "./AvailabilityGrid";

interface CalendarImportSectionProps {
  timeSlots: TimeSlotProps[];
  onImportCalendar?: (provider: "google" | "outlook") => void;
  event: EventProps;
  currentUserId: string;
}

function CalendarImportSectionComponent({
  timeSlots,
  onImportCalendar,
  event,
  currentUserId,
}: CalendarImportSectionProps) {
  return (
    <div className={AVAILABILITY_CONSTANTS.CONTAINER_CLASSES}>
      <CalendarImportHeader event={event} currentUserId={currentUserId} />
      <CalendarImportButtons onImport={onImportCalendar} />
      <div className={AVAILABILITY_CONSTANTS.DIVIDER_CLASSES} />

      <div className={AVAILABILITY_CONSTANTS.GRID_CONTAINER_CLASSES}>
        <AvailabilityGrid
          timeSlots={timeSlots}
          event={event}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}

export default CalendarImportSectionComponent;
