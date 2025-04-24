import { AvailabilityProps, TimeSlotProps } from "../../Event/event.types";
import {
  createUserAvailability,
  deleteUserAvailability,
} from "@/api/availability";
import { getColor } from "@/lib/getColor";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import AvailabilityGrid from "./AvailabilityGrid";

function UserAvailability({
  url,
  eventTimeSlots,
}: {
  url: string;
  eventTimeSlots: TimeSlotProps[];
}) {
  const { user, userTimeSlots, dispatch } = useAvailabilityContext();

  const handleTimeSlotClick = async (slot: number) => {
    const userTimeSlot = userTimeSlots.find(
      (uts: AvailabilityProps) => uts.time_slot_id === slot
    );

    if (userTimeSlot && userTimeSlot.time_slot_id) {
      const response = await deleteUserAvailability(url, userTimeSlot.id);
      console.log({ response });
      if (response.success) {
        dispatch({
          type: "DELETE_USER_SLOT",
          payload: {
            id: userTimeSlot.id,
            time_slot_id: userTimeSlot.time_slot_id,
            user_id: userTimeSlot.user.id,
          },
        });
      } else {
        console.warn("unable to delete a time slot");
      }
    } else {
      const response = await createUserAvailability(url, {
        user_id: user?.id,
        time_slot: slot,
      });
      if (response.success && user?.id) {
        dispatch({
          type: "ADD_USER_SLOT",
          payload: response.data.availability,
        });
      } else {
        console.warn("unable to create a time slot");
      }
    }
  };
  console.log({ userTimeSlots });
  const getTimeSlotColor = (id: number) => {
    return userTimeSlots.find(
      (uts: AvailabilityProps) => uts.time_slot_id === id
    )
      ? getColor(1, 1)
      : getColor(0, 1);
  };
  return (
    <div className="flex flex-col gap-10">
      <div className="font-bold text-md text-center">
        Please select your availability
      </div>
      <AvailabilityGrid
        eventTimeSlots={eventTimeSlots}
        color={(id: number) => getTimeSlotColor(id)}
        handleTimeSlotClick={handleTimeSlotClick}
      />
    </div>
  );
}

export default UserAvailability;
