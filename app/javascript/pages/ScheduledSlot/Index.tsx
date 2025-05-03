import { Button } from "@/components/ui/button";
import GroupAvailability from "../Availability/components/GroupAvailability";
import useGetAvailabilities from "@/hooks/useGetAvailabilities";
import { CheckIcon, InfoIcon } from "lucide-react";
import { useEffect } from "react";
import { EventProps } from "../Event/event.types";

import { useAvailabilityContext } from "../Availability/context/AvailabilityContext";
import { router } from "@inertiajs/react";
import { createBatchScheduledSlot } from "@/api/event";
import { Alert, AlertDescription } from "@/components/ui/alert";

function Index({
  event,
  scheduled_slots: scheduledSlots,
}: {
  event: EventProps;
  scheduled_slots: number[];
}) {
  useGetAvailabilities({ event });
  const { dispatch, scheduledTimeSlots: currentScheduledSlots } =
    useAvailabilityContext();

  const handleTimeSlotClick = (slotId: number) => {
    if (currentScheduledSlots.includes(slotId)) {
      dispatch({ type: "DELETE_SCHEDULED_SLOT", payload: slotId });
    } else {
      dispatch({ type: "ADD_SCHEDULED_SLOT", payload: slotId });
    }
  };
  const handleScheduleClick = async () => {
    const response = await createBatchScheduledSlot(
      event.url,
      currentScheduledSlots
    );
    if (response.success) {
      router.visit(`/events/${event.url}/schedule`, {
        preserveState: true,
      });
    }
  };
  useEffect(() => {
    if (scheduledSlots.length)
      dispatch({ type: "SET_SCHEDULED_SLOTS", payload: scheduledSlots });
  }, []);
  return (
    <div className="md:w-1/2 mx-auto flex flex-col gap-10">
      <Alert className="md:mx-auto p-4 flex gap-3 text-blue-800 rounded-md items-center bg-blue-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription className="text-sm text-blue-800">
          Scheduling can be finalized once all participants have submitted their
          availability.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-center md:relative">
        <div className="font-bold underline">Schedule the event</div>
        <Button
          className="md:absolute md:right-0"
          onClick={handleScheduleClick}
          disabled={!currentScheduledSlots.length}
        >
          <CheckIcon className="w-4 h-4 stroke-3" /> Schedule
        </Button>
      </div>
      <GroupAvailability
        eventTimeSlots={event.time_slots}
        handleTimeSlotClick={handleTimeSlotClick}
      />
    </div>
  );
}

export default Index;
