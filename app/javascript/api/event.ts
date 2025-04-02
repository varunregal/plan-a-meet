import { api } from "@/lib/api";

export const createEvent = async (event: any) => {
  try {
    const response = await api.post("/events", { event });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.log(error.response)
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }else{
      return {
        success: false,
        message: "Could not connect to the server"
      }
    }
  }
};
