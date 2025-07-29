import { memo } from 'react';
import { TimeSlotProps } from "../event.types";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";

interface AvailabilitySectionProps {
  timeSlots: TimeSlotProps[];
  selectedSlots: Set<number>;
  onSlotClick: (slotId: number) => void;
  showGroupAvailability: boolean;
  availabilityData?: { [key: string]: string[] };
}

export const AvailabilitySection = memo(({
  timeSlots,
  selectedSlots,
  onSlotClick,
  showGroupAvailability,
  availabilityData,
}: AvailabilitySectionProps) => {
  return (
    <div className={AVAILABILITY_CONSTANTS.GRID_CONTAINER_CLASSES}>
      <AvailabilityGrid
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        onSlotClick={onSlotClick}
        showGroupAvailability={showGroupAvailability}
        availabilityData={availabilityData}
      />
    </div>
  );
});