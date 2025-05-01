import { Button } from "@/components/ui/button";
import GroupAvailability from "../Availability/components/GroupAvailability";
import useGetAvailabilities from "@/hooks/useGetAvailabilities";
import { CheckIcon, EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { EventProps, TimeSlotProps } from "../Event/event.types";
import { createScheduledSlot, getScheduledSlots } from "@/api/scheduledSlot";
import { useAvailabilityContext } from "../Availability/context/AvailabilityContext";

function Index({
  event,
  scheduled_slots: scheduledSlots,
}: {
  event: EventProps;
  scheduled_slots: number[];
}) {
  useGetAvailabilities({ event });
  const [edit, setEdit] = useState(false);
  const { dispatch } = useAvailabilityContext();
  const handleTimeSlotClick = async (time_slot_id: number) => {
    if (edit) {
      const response = await createScheduledSlot(event.url, time_slot_id);
      if (response.success) {
        dispatch({
          type: "ADD_SCHEDULED_SLOT",
          payload: response.data.time_slot_id,
        });
      }
    }
  };

  useEffect(() => {
    if (scheduledSlots.length)
      dispatch({ type: "SET_SCHEDULED_SLOTS", payload: scheduledSlots });
  }, []);
  return (
    <div className="md:w-1/2 mx-auto text-center flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div className="font-bold underline">Schedule the event</div>
        {!edit ? (
          <Button
            variant="secondary"
            onClick={() => {
              setEdit(true);
            }}
          >
            Schedule <EditIcon className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setEdit(false);
            }}
          >
            <CheckIcon className="w-4 h-4" /> Done
          </Button>
        )}
      </div>
      <GroupAvailability
        eventTimeSlots={event.time_slots}
        canSchedule={edit}
        handleTimeSlotClick={edit ? handleTimeSlotClick : () => {}}
      />
    </div>
  );
}

export default Index;
