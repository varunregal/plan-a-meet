import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import AvailabilityHome from "../Availability/components/AvailabilityHome";
import { EventProps, UserProps } from "./event.types";

function Show({ event }: { event: EventProps }) {
  const { name, url, time_slots } = event;

  return (
    <AvailabilityProvider>
      <AvailabilityHome name={name} url={url} eventTimeSlots={time_slots} />
    </AvailabilityProvider>
  );
}

export default Show;
