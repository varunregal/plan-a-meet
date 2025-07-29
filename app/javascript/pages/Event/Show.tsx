import { useState } from "react";
import EventHeader from "./components/EventHeader";
import InvitePeopleDialog from "./components/InvitePeopleDialog";
import { EventProps, InvitationProps, TimeSlotProps } from "./event.types";

function EventShow({
  event,
  event_creator,
  invitations,
  is_creator,
  time_slots,
}: {
  event: EventProps;
  invitations: InvitationProps[];
  event_creator?: string;
  is_creator: boolean;
  time_slots: TimeSlotProps[];
}) {
  console.log({ event, event_creator });
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <EventHeader
          event={event}
          creatorName={event_creator}
          invitations={invitations}
        />
      </div>
    </div>
  );
}

export default EventShow;
