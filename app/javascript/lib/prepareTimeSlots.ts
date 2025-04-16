function prepareTimeSlots(timeSlots: any) {
  return timeSlots.reduce((acc: any, current: any) => {
    const currentDate = new Date(current.start_time).toLocaleDateString();
    acc[currentDate] = acc[currentDate] || [];
    acc[currentDate].push(current);
    return acc;
  }, {});
}

export default prepareTimeSlots;
