function prepareTimeSlots(timeSlots: any) {
  return timeSlots.reduce((acc: any, current: any) => {
    const currentDate = new Date(current.start_time).toLocaleDateString();
    acc[currentDate] = acc[currentDate] || [];
    acc[currentDate].push(current);
    return acc;
  }, {});
  // const map = new Map<string, any>();
  // for (let k = 0; k < timeSlots.length; k++) {
  //   const currentDate = new Date(timeSlots[k].start_time).toLocaleDateString();
  //   map.set(currentDate, map.get(currentDate) || []);
  //   map.get(currentDate).push(timeSlots[k]);
  // }
  // return map;
}

export default prepareTimeSlots;
