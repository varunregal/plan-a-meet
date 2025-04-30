import { Separator } from "@/components/ui/separator";
import EventHeader from "@/pages/Event/components/EventHeader";
import { EventProps } from "@/pages/Event/event.types";
import UserLoginWithAvailability from "@/pages/Event/components/UserLoginWithAvailability";

function Event({ event }: { event: EventProps }) {
  return (
    <div className="flex flex-col gap-10">
      <EventHeader event={event} />
      <Separator />
      <UserLoginWithAvailability event={event} />
    </div>
  );
}

export default Event;
