import { AvailabilityProvider } from "../Availability/context/AvailabilityContext";
import AvailabilityHome from "../Availability/components/AvailabilityHome";
import { EventProps } from "./event.types";
import { usePage } from "@inertiajs/react";

function Show({ event }: { event: EventProps }) {
  const { name, url, time_slots } = event;
  console.log(usePage().props);
  return (
    <AvailabilityProvider>
      <div>This is Show page</div>
      <AvailabilityHome name={name} url={url} eventTimeSlots={time_slots} />
    </AvailabilityProvider>
  );
}

export default Show;
