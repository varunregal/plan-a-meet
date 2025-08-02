import EventHeader from "./components/EventHeader";
import { EventProps, InvitationProps, TimeSlotProps } from "./event.types";
import { AuthAlert } from "./components/AuthAlert";
import CalendarImportSection from "./components/CalendarImportSection";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { AvailabilitySidebar } from "./components/AvailabilitySidebar";
import { usePage } from "@inertiajs/react";
import { AvailabilityLegend } from "./components/AvailabilityLegend";
import { useEventStore } from "@/stores/eventStore";

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
  const { current_user } = usePage().props;
  const [availabilityData, setAvailabilityData] = useState<{
    [key: string]: string[];
  }>({});

  const setCurrentUserSlots = useEventStore(
    (state) => state.setCurrentUserSlots,
  );
  const setTotalParticipants = useEventStore(
    (state) => state.setTotalParticipants,
  );
  const selectedSlots = useEventStore((state) => state.selectedSlots);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const [participantName, setParticipantName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);

  const isAnonymous = !current_user;

  const handleNameChange = (name: string) => {
    setParticipantName(name);
    if (name.trim()) {
      setNameError("");
    }
  };
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.get(`/events/${event.url}/availabilities`);
        const {
          current_user_slots,
          availability_data,
          total_event_participants,
        } = response.data;
        setCurrentUserSlots(current_user_slots || []);
        setAvailabilityData(availability_data || {});
        setTotalParticipants(total_event_participants || 0);
      } catch (error) {
        console.error("Failed to fetch availability data", error);
        toast.error("Failed to fetch users availability for this event");
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [event.url]);

  useEffect(() => {
    if (isAnonymous) {
      const cookies = document.cookie.split(";");
      const nameCookie = cookies.find((c) =>
        c.trim().startsWith("participant_name="),
      );
      if (nameCookie) {
        const name = decodeURIComponent(nameCookie.split("=")[1]);
        setParticipantName(name);
      }
    }
  }, [isAnonymous]);

  const handleSaveAvailability = async () => {
    if (isAnonymous && !participantName.trim()) {
      setNameError("Please enter your name to save");
      return;
    }
    setIsSaving(true);
    try {
      const payload: { time_slot_ids: number[]; participant_name?: string } = {
        time_slot_ids: Array.from(selectedSlots),
      };
      if (isAnonymous) {
        payload.participant_name = participantName.trim();
      }
      await api.post(`/events/${event.url}/availabilities`, payload);
      setCurrentUserSlots(Array.from(selectedSlots));
      toast.success("Availability saved successfully!");
      if (isAnonymous) {
        document.cookie = `participant_name=${encodeURIComponent(participantName.trim())}; max-age=${
          30 * 24 * 60 * 60
        }; path=/`;
      }
    } catch (error) {
      console.error("Failed to save availability", error);
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-3">
              <CalendarImportSection
                timeSlots={time_slots}
                availabilityData={availabilityData}
              />
            </div>
            <div className="lg:sticky lg:top-4 self-start">
              <div className="space-y-4">
                <AvailabilitySidebar
                  participantName={participantName}
                  onNameChange={handleNameChange}
                  onSaveAvailability={handleSaveAvailability}
                  isSaving={isSaving}
                  isAnonymous={isAnonymous}
                  nameError={nameError}
                />
                <AvailabilityLegend />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventShow;
