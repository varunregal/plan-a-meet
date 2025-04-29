import UserAvailability from "../Availability/components/UserAvailability";
import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import { EventProps } from "./event.types";

function Show({ event }: { event: EventProps }) {
  return (
    <AvailabilityProvider>
      <UserAvailability event={event} />
    </AvailabilityProvider>
  );
}

export default Show;
