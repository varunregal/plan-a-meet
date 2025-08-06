import { TimeSlotProps } from "../event.types";
import { useGridData } from "../hooks/useGridData";

function AvailabilityGrid({ timeSlots }: { timeSlots: TimeSlotProps[] }) {
  const { hours, dates, getSlot } = useGridData({ timeSlots });

  return <div>Availability Grid</div>;
}

export default AvailabilityGrid;
