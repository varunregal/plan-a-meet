import { Button } from "@/components/ui/button";
import GroupAvailability from "../Availability/components/GroupAvailability";
import useGetAvailabilities from "@/hooks/useGetAvailabilities";
import { CheckIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import { EventProps } from "../Event/event.types";

function Index({ event }: { event: EventProps }) {
  useGetAvailabilities({ event });
  const [edit, setEdit] = useState(false);
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
      <GroupAvailability eventTimeSlots={event.time_slots} canSchedule={edit} />
    </div>
  );
}

export default Index;
