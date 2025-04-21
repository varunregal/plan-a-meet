import { api } from "@/lib/api";

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

export const getUserEventAvailabilities = async (url: string) => {
  try {
    const response = await api.get(`/events/${url}/user_availabilities`);
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
