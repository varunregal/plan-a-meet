import {
  createCurrentUserAvailability,
  deleteCurrentUserAvailability,
  getAvailabilities,
} from "@/api/availability";
import { prepareGroupTimeSlots } from "@/lib/prepareGroupTimeSlots";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import {
  AvailabilityProps,
  EventProps,
  UserProps,
} from "@/pages/Event/event.types";
import { useEffect } from "react";
import { toast } from "sonner";

function useUserAvailability({
  current_user,
  event,
}: {
  current_user: UserProps;
  event: EventProps;
}) {
  const { users, dispatch, userTimeSlots } = useAvailabilityContext();
  useEffect(() => {
    const fetchAvailabilities = async () => {
      const response = await getAvailabilities(event.url);
      if (response.success) {
        dispatch({ type: "SET_USERS", payload: response.data.participants });

        dispatch({
          type: "SET_GROUP_TIME_SLOTS",
          payload: prepareGroupTimeSlots(response.data.availabilities),
        });
        dispatch({
          type: "SET_USER_TIME_SLOTS",
          payload: response.data.current_user_availabilities,
        });
      } else console.warn(response.errors.join("\n"));
    };
    fetchAvailabilities();
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_USER", payload: current_user });
  }, [current_user]);

  const handleTimeSlotClick = async (timeSlot: number) => {
    const isUserTimeSlot = userTimeSlots.find(
      (ts: AvailabilityProps) => ts.time_slot_id === timeSlot
    );
    const isOldUser = users.find(
      (user: UserProps) => user.id === current_user.id
    );
    if (!isOldUser) dispatch({ type: "ADD_USER", payload: current_user });

    if (!isUserTimeSlot) {
      const response = await createCurrentUserAvailability(timeSlot);

      if (response.success)
        dispatch({
          type: "ADD_USER_SLOT",
          payload: response.data.availability,
        });
      else toast.error(response.errors.join("\n"));
    } else {
      const response = await deleteCurrentUserAvailability(timeSlot);
      if (response.success)
        dispatch({
          type: "DELETE_USER_SLOT",
          payload: response.data.availability,
        });
      else toast.error(response.errors.join("\n"));
    }
  };

  return { handleTimeSlotClick };
}

export default useUserAvailability;
