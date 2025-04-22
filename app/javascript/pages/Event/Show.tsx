import { TimeSlotProps } from "./event.types";
import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import AvailabilityHome from "../Availability/components/AvailabilityHome";

function Show({
  name,
  url,
  timeSlots,
  numberOfEventUsers,
}: {
  name: string;
  url: string;
  timeSlots: TimeSlotProps[];
  numberOfEventUsers: number;
}) {
  return (
    <AvailabilityProvider>
      <AvailabilityHome
        name={name}
        url={url}
        timeSlots={timeSlots}
        eventUsers={numberOfEventUsers}
      />
    </AvailabilityProvider>
  );
}

export default Show;
