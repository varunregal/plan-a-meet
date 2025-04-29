import { Separator } from "@/components/ui/separator";
import EventHeader from "@/pages/Event/components/EventHeader";
import { AvailabilityProps, EventProps } from "@/pages/Event/event.types";
import SelectUserAvailability from "./SelectUserAvailability";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import { getColor } from "@/lib/getColor";
import AvailabilityGrid from "./AvailabilityGrid";
import { get } from "react-hook-form";

function UserAvailability({ event }: { event: EventProps }) {
  const { userTimeSlots } = useAvailabilityContext();
  const getTimeSlotColor = (id: number) => {
    return userTimeSlots.find(
      (uts: AvailabilityProps) => uts.time_slot_id === id
    )
      ? getColor(1, 1)
      : getColor(0, 1);
  };
  return (
    <div className="flex flex-col gap-10">
      <EventHeader event={event} />
      <Separator />
      <div className="flex flex-col gap-5">
        <div className="text-md font-medium">Add your availabilities</div>
        <AvailabilityGrid
          eventTimeSlots={event.time_slots}
          color={(id: number) => getTimeSlotColor(id)}
          handleTimeSlotClick={() => {}}
        />
      </div>
    </div>
  );
}

export default UserAvailability;
