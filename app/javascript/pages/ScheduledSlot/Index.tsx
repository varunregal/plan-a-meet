import { Button } from "@/components/ui/button";
import GroupAvailability from "../Availability/components/GroupAvailability";
import useGetAvailabilities from "@/hooks/useGetAvailabilities";
import { CheckIcon, EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  EventProps,
  ScheduledSlotProps,
  TimeSlotProps,
} from "../Event/event.types";
import {
  createScheduledSlot,
  deleteScheduledSlot,
  getScheduledSlots,
} from "@/api/scheduledSlot";
import { useAvailabilityContext } from "../Availability/context/AvailabilityContext";
import { router } from "@inertiajs/react";
import { createBatchScheduledSlot } from "@/api/event";

function Index({
  event,
  scheduled_slots: scheduledSlots,
}: {
  event: EventProps;
  scheduled_slots: number[];
}) {
  useGetAvailabilities({ event });
  const [edit, setEdit] = useState(false);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:relative">
        <div className="font-bold underline">Schedule the event</div>
        {!!currentScheduledSlots.length && (
          <Button
            className="md:absolute md:right-0"
            onClick={handleScheduleClick}
          >
            <CheckIcon className="w-4 h-4 stroke-3" /> Schedule
          </Button>
        )}
      </div>
      <GroupAvailability
        eventTimeSlots={event.time_slots}
        canSchedule={edit}
        handleTimeSlotClick={handleTimeSlotClick}
      />
    </div>
  );
}

export default Index;
