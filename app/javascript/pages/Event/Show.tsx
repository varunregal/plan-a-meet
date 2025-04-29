import UserAvailability from "../Availability/components/UserAvailability";
import { EventProps } from "./event.types";

function Show({ event }: { event: EventProps }) {
  return <UserAvailability event={event} />;
}

export default Show;
