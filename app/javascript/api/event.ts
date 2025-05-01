import { api, requestJSON } from "@/lib/api";

export const createEvent = async (event: any) => {
  try {
    const response = await api.post("/events", { event });
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return {
        success: false,
        message: "Could not connect to the server",
      };
    }
  }
};

export const createBatchScheduledSlot = (
  eventSlug: string,
  time_slot_ids: number[]
) =>
  requestJSON<any>({
    method: "PATCH",
    url: `/events/${eventSlug}/schedule`,
    data: { slot_ids: time_slot_ids },
  });
