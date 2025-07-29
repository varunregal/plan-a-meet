import EventHeader from "./components/EventHeader";
import { EventProps, InvitationProps, TimeSlotProps } from "./event.types";
import { AuthAlert } from "./components/AuthAlert";
import CalendarImportSection from "./components/CalendarImportSection";

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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <EventHeader
            event={event}
            creatorName={event_creator}
            invitations={invitations}
          />
          <AuthAlert />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <CalendarImportSection timeSlots={time_slots} />
            </div>
            <div className="space-y-6">{/* TODO: Side bar Component  */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventShow;
