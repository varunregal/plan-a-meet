import {
  AvailabilityProvider,
  useAvailabilityContext,
} from "../Availability/context/AvailabilityContext";
import AvailabilityHome from "../Availability/components/AvailabilityHome";
import { EventProps, UserProps } from "./event.types";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

function Show({ event, user }: { event: EventProps; user: UserProps }) {
  const { name, url, time_slots } = event;

  return (
    <AvailabilityProvider>
      <AvailabilityHome
        user={user}
        name={name}
        url={url}
        eventTimeSlots={time_slots}
      />
    </AvailabilityProvider>
  );
}

export default Show;
