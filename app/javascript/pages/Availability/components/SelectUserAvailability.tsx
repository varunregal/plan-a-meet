import { TimeSlotProps } from "@/pages/Event/event.types";
import AvailabilityGrid from "./AvailabilityGrid";

function SelectUserAvailability({
  eventTimeSlots,
}: {
  eventTimeSlots: TimeSlotProps[];
}) {
  return (
    <div>
      <div className="text-md font-medium">Add your availabilities</div>
    </div>
  );
}

export default SelectUserAvailability;
