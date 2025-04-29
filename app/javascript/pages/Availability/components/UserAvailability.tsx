import { Separator } from "@/components/ui/separator";
import EventHeader from "@/pages/Event/components/EventHeader";
import { EventProps } from "@/pages/Event/event.types";

function UserAvailability({ event }: { event: EventProps }) {
  return (
    <div className="flex flex-col gap-10">
      <EventHeader event={event} />
      <Separator />
    </div>
  );
}

export default UserAvailability;
