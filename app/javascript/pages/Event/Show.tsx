import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import { EventProps } from "./event.types";
import GuestLogin from "../User/components/GuestLogin";

function Show({ event }: { event: EventProps }) {
  return (
    <AvailabilityProvider>
      <GuestLogin event={event} />
    </AvailabilityProvider>
  );
}

export default Show;
