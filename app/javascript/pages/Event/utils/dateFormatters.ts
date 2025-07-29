export function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour || 12;
  return `${displayHour}:00 ${period}`;
}

export function formatTimeRange(hour: number, minute: number): { start: string; end: string } {
  const startTime = `${hour}:${minute.toString().padStart(2, '0')}`;
  const endHour = minute === 45 ? hour + 1 : hour;
  const endMinute = minute === 45 ? 0 : minute + 15;
  const endTime = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
  
  return { start: startTime, end: endTime };
}