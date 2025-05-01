import { TimeSlotProps } from "@/pages/Event/event.types";

function prepareTimeSlots(timeSlots: TimeSlotProps[]) {
  return timeSlots.reduce((acc: any, current: TimeSlotProps) => {
    const currentDate = new Date(current.start_time).toLocaleDateString();
    acc[currentDate] = acc[currentDate] || [];
    acc[currentDate].push(current);
    return acc;
  }, {});
}

export default prepareTimeSlots;
