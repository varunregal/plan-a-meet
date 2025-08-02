import { memo } from "react";
import { TimeSlotProps } from "../event.types";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";

interface AvailabilitySectionProps {
  timeSlots: TimeSlotProps[];
  onSlotClick: (slotId: number) => void;
  availabilityData: { [key: string]: string[] };
}

export const AvailabilitySection = memo(
  ({ timeSlots, onSlotClick, availabilityData }: AvailabilitySectionProps) => {
    return (
      <div className={AVAILABILITY_CONSTANTS.GRID_CONTAINER_CLASSES}>
        <AvailabilityGrid
          timeSlots={timeSlots}
          onSlotClick={onSlotClick}
          availabilityData={availabilityData}
        />
      </div>
    );
  },
);
