import EventHeader from "./components/EventHeader";
import {
  EventProps,
  InvitationProps,
  TimeSlotProps,
  UserProps,
} from "./event.types";
import { AuthAlert } from "./components/AuthAlert";
import CalendarImportSection from "./components/CalendarImportSection";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";
import { useEventStore } from "@/stores/eventStore";
import { NameInputDialog } from "./components/NameInputDialog";
import { ParticipantsList } from "./components/ParticipantsList";

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
  // const {
  //   selectedSlots,
  //   setSelectedSlots,
  //   saveEditing,
  //   setTotalParticipants,
  //   setCurrentUserSlots,
  //   setParticipants,
  // } = useEventStore();
  const setSelectedSlots = useEventStore((state) => state.setSelectedSlots);
  const saveEditing = useEventStore((state) => state.saveEditing);
  const setTotalParticipants = useEventStore(
    (state) => state.setTotalParticipants,
  );
  const setCurrentUserSlots = useEventStore(
    (state) => state.setCurrentUserSlots,
  );
  const setParticipants = useEventStore((state) => state.setParticipants);
  const renderingCount = useRef(0);
  const [availabilityData, setAvailabilityData] = useState<{
    [key: string]: string[];
  }>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [participantName, setParticipantName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);

  const isAnonymous = !current_user;

  const handleNameChange = (name: string) => {
    setParticipantName(name);
    if (name.trim()) {
      setNameError("");
    }
  };
  renderingCount.current += 1;
  console.log({ renderingCount: renderingCount.current });
  const fetchAvailability = async () => {
    try {
      const response = await api.get(`/events/${event.url}/availabilities`);
      const {
        current_user_slots,
        availability_data,
        total_event_participants,
        participants,
      } = response.data;
      setCurrentUserSlots(current_user_slots || []);
      setSelectedSlots(new Set(current_user_slots || []));
      setAvailabilityData(availability_data || {});
      setTotalParticipants(total_event_participants || 0);
      setParticipants(participants || []);
    } catch (error) {
      console.error("Failed to fetch availability data", error);
      toast.error("Failed to fetch users availability for this event");
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [event.url, (current_user as UserProps)?.id]);

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

  const handleSaveClick = () => {
    if (isAnonymous && !participantName.trim()) {
      setShowNameDialog(true);
    } else {
      handleSaveAvailability();
    }
  };

  const handleSaveAvailability = async () => {
    const selectedSlots = useEventStore.getState().selectedSlots;
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
      saveEditing();
      toast.success("Availability saved successfully!");

      await fetchAvailability();
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

  const handleNameConfirm = () => {
    if (participantName.trim()) {
      setShowNameDialog(false);
      setNameError("");
      handleSaveAvailability();
    } else {
      setNameError("Please enter your name");
    }
  };

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
                  availabilityData={availabilityData}
                  onSaveAvailability={handleSaveClick}
                  isSaving={isSaving}
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
      <NameInputDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        participantName={participantName}
        onNameChange={handleNameChange}
        onConfirm={handleNameConfirm}
        nameError={nameError}
      />
    </>
  );
}

export default EventShow;
