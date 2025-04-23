import { TimeSlotProps } from "../../Event/event.types";
import { createUserAvailability } from "@/api/availability";
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
    const availability = {
      user_id: user?.id,
      time_slot: slot,
    };
    const response = await createUserAvailability(url, availability);
    if (response.success && user?.id) {
      dispatch({
        type: "ADD_USER_SLOT",
        payload: {
          user: response.data.availability.user,
          time_slot_id: response.data.availability.time_slot_id,
        },
      });
    } else {
      console.warn("unable to create a time slot");
    }
  };

  const getTimeSlotColor = (id: number) => {
    return userTimeSlots.includes(id) ? getColor(1, 1) : getColor(0, 1);
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
