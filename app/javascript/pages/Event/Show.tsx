import EventHeader from "./components/EventHeader";
import { EventProps, InvitationProps, TimeSlotProps } from "./event.types";
import { AuthAlert } from "./components/AuthAlert";
import CalendarImportSection from "./components/CalendarImportSection";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

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
  const [availabilityData, setAvailabilityData] = useState<{
    [key: string]: string[];
  }>({});
  const [currentUserSlots, setCurrentUserSlots] = useState<number[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.get(`/events/${event.url}/availabilities`);
        const { current_user_slots, availability_data } = response.data;
        setCurrentUserSlots(current_user_slots || []);
        setAvailabilityData(availability_data || {});
      } catch (error) {
        console.error("Failed to fetch availability data", error);
        toast.error("Failed to fetch users availability for this event");
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [event.url]);
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
              <CalendarImportSection
                timeSlots={time_slots}
                eventUrl={event.url}
                currentUserSlots={currentUserSlots}
                availabilityData={availabilityData}
                isLoading={isLoadingAvailability}
              />
            </div>
            <div className="space-y-6">{/* TODO: Side bar Component  */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventShow;
