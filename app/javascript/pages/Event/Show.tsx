import EventHeader from "./components/EventHeader";
import { EventProps, TimeSlotProps } from "./event.types";

function EventShow({
  event,
  event_creator,
  is_creator,
  time_slots,
}: {
  event: EventProps;
  event_creator?: string;
  is_creator: boolean;
  time_slots: TimeSlotProps[];
}) {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <EventHeader
          name={event.name}
          url={event.url}
          creatorName={event_creator}
        />
      </div>
    </div>
  );
}

export default EventShow;
