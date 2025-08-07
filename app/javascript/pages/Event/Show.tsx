import EventHeader from "./components/EventHeader";
import {
  EventProps,
  InvitationProps,
  TimeSlotProps,
  UserProps,
} from "./event.types";
import { AuthAlert } from "./components/AuthAlert";
import CalendarImportSection from "./components/CalendarImportSection";
import { useEffect } from "react";
import { useEventStore } from "@/stores/eventStore";
import { ParticipantsList } from "./components/ParticipantsList";

function EventShow({
  event,
  event_creator,
  invitations,
  is_creator,
  time_slots,
  current_user_id,
}: {
  event: EventProps;
  invitations: InvitationProps[];
  event_creator?: string;
  is_creator: boolean;
  time_slots: TimeSlotProps[];
  current_user_id: string;
}) {
  const setEventData = useEventStore((state) => state.setEventData);
  useEffect(() => {
    setEventData({ event, currentUserId: current_user_id });
  }, [event, current_user_id]);
  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <EventHeader
              event={event}
              isCreator={is_creator}
              creatorName={event_creator}
              invitations={invitations}
            />
            <AuthAlert />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-3">
                <CalendarImportSection
                  timeSlots={time_slots}
                  event={event}
                  currentUserId={current_user_id}
                />
              </div>
              <div className="lg:sticky lg:top-4 self-start">
                <div className="space-y-4">
                  <ParticipantsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<NameInputDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        handleSaveAvailability={handleSaveAvailability}
      />*/}
    </>
  );
}

export default EventShow;
