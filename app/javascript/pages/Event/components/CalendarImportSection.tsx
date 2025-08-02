import { memo } from "react";
import { TimeSlotProps } from "../event.types";
import { CalendarImportButtons } from "./CalendarImportButtons";
import { CalendarImportHeader } from "./CalendarImportHeader";
import { AvailabilitySection } from "./AvailabilitySection";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";
import { useEventStore } from "@/stores/eventStore";

interface CalendarImportSectionProps {
  timeSlots: TimeSlotProps[];
  availabilityData: { [key: string]: string[] };
  onImportCalendar?: (provider: "google" | "outlook") => void;
}

function CalendarImportSectionComponent({
  timeSlots,
  availabilityData,
  onImportCalendar,
}: CalendarImportSectionProps) {
  const toggleSlot = useEventStore((state) => state.toggleSlot);
  const handleSlotClick = (slotId: number) => {
    toggleSlot(slotId);
  };
  return (
    <div className={AVAILABILITY_CONSTANTS.CONTAINER_CLASSES}>
      <CalendarImportHeader />
      <CalendarImportButtons onImport={onImportCalendar} />
      <div className={AVAILABILITY_CONSTANTS.DIVIDER_CLASSES} />

      <AvailabilitySection
        timeSlots={timeSlots}
        onSlotClick={handleSlotClick}
        availabilityData={availabilityData}
      />
    </div>
  );
}

export default memo(CalendarImportSectionComponent);
