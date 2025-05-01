import Event from "./components/Event";
import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import { EventProps } from "./event.types";

function Show({ event }: { event: EventProps }) {
  return <Event event={event} />;
}

export default Show;
