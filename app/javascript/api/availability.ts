import { api, requestJSON } from "@/lib/api";
import { AvailabilityProps, UserProps } from "@/pages/Event/event.types";

export const createUserAvailability = async (
  url: string,
  availability: any
) => {
  try {
    const response = await api.post(`/events/${url}/user_availabilities`, {
      user_availabilities: availability,
    });
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

export const deleteUserAvailability = async (url: string, id: number) => {
  try {
    const response = await api.delete(`/events/${url}/user_availabilities/${id}`);
    return { success: true, data: response.data };
  }catch (error: any) {
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
}


export interface AvailabilitiesPayload {
  availabilities: AvailabilityProps[]
  current_user_availabilities: AvailabilityProps[]
  participants: UserProps[]
}

export const getAvailabilities = (eventSlug: string) =>
  requestJSON<any>({
    method: "GET",
    url: `/events/${eventSlug}/availabilities`,
  })

export const createCurrentUserAvailability = (timeSlotSlug:number) => 
  requestJSON<any>({
    method: "POST",
    url: `/time_slots/${timeSlotSlug}/availability`,
  })
  export const deleteCurrentUserAvailability = (timeSlotSlug:number) => 
    requestJSON<any>({
      method: "DELETE",
      url: `/time_slots/${timeSlotSlug}/availability`,
    })
