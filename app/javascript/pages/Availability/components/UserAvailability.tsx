import { Button } from "@/components/ui/button";
import AvailabilityGrid from "./AvailabilityGrid";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import {
  AvailabilityProps,
  EventProps,
  UserProps,
} from "@/pages/Event/event.types";
import { getColor } from "@/lib/getColor";
import { router, usePage } from "@inertiajs/react";
import { api } from "@/lib/api";
import {
  createUserAvailability,
  deleteUserAvailability,
  getUserGroupAvailabilities,
} from "@/api/availability";
import { useEffect } from "react";
import { prepareGroupTimeSlots } from "@/lib/prepareGroupTimeSlots";
import GroupAvailability from "./GroupAvailability";

function UserAvailability({ event }: { event: EventProps }) {
  const { current_user }: { current_user: UserProps } = usePage<any>().props;
  const { userTimeSlots, dispatch } = useAvailabilityContext();

  const getTimeSlotColor = (id: number) => {
    return userTimeSlots.find(
      (uts: AvailabilityProps) => uts.time_slot_id === id
    )
      ? getColor(1, 1)
      : getColor(0, 1);
  };

  const handleTimeSlotClick = async (time_slot: number) => {};
  return (
    <div>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-10 items-center">
          <div className="text-md font-medium">Your Availability</div>
          <AvailabilityGrid
            eventTimeSlots={event.time_slots}
            color={(id: number) => getTimeSlotColor(id)}
            handleTimeSlotClick={handleTimeSlotClick}
          />
        </div>
        <GroupAvailability eventTimeSlots={event.time_slots} url={event.url} />
      </div>
    </div>
  );
}

export default UserAvailability;
