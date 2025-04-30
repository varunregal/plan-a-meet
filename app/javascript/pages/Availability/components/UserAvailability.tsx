import { Separator } from "@/components/ui/separator";
import EventHeader from "@/pages/Event/components/EventHeader";
import { AvailabilityProps, EventProps } from "@/pages/Event/event.types";
import SelectUserAvailability from "./SelectUserAvailability";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import { getColor } from "@/lib/getColor";
import AvailabilityGrid from "./AvailabilityGrid";
import { get } from "react-hook-form";
import { Button } from "@/components/ui/button";
import UserLogin from "@/pages/Event/components/UserLogin";

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
      <UserLogin event={event} />
      {/* <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Availability</div>
          <div>
            <Button variant={"secondary"}>Add Availaibility</Button>
          </div>
        </div>
        <AvailabilityGrid
          eventTimeSlots={event.time_slots}
          color={(id: number) => getTimeSlotColor(id)}
          handleTimeSlotClick={() => {}}
        />
      </div> */}
    </div>
  );
}

export default UserAvailability;
