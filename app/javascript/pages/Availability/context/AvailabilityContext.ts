import { AvailabilityProps, TimeSlotProps, UserProps } from "@/pages/Event/event.types";
import { createContext, useContext } from "react";

type AvailabilityContextProps = {
  eventTimeSlots: TimeSlotProps[]
  eventUrl: string
  userId?: number
  userTimeSlots: number[]
  setUserTimeSlots: any
  
}
export const AvailabilityContext = createContext<AvailabilityContextProps | undefined>(undefined)

export const useAvailabilityContext = () => {
  const context = useContext(AvailabilityContext);
  if(context === undefined){
    throw new Error("AvailabilityContext is used outside it's limits")
  }
  return context
}