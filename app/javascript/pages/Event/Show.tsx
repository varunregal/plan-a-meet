import { TimeSlotProps } from "./event.types";
import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import AvailabilityHome from "../Availability/components/AvailabilityHome";

function Show({
  name,
  url,
  timeSlots,
}: {
  name: string;
  url: string;
  timeSlots: TimeSlotProps[];
}) {
  return (
    <AvailabilityProvider>
      <AvailabilityHome name={name} url={url} timeSlots={timeSlots} />
    </AvailabilityProvider>
  );
}

export default Show;
