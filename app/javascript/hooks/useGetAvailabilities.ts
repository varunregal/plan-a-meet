import { getAvailabilities } from "@/api/availability";
import { prepareGroupTimeSlots } from "@/lib/prepareGroupTimeSlots";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import { EventProps } from "@/pages/Event/event.types";
import { useEffect } from "react";

function useGetAvailabilities({ event }: { event: EventProps }) {
  const { dispatch } = useAvailabilityContext();
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
}
export default useGetAvailabilities;
