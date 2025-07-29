export const DEFAULT_TOTAL_PARTICIPANTS = 5;

export function getAvailabilityStyle(
  count: number,
  totalParticipants: number = DEFAULT_TOTAL_PARTICIPANTS
): { bg: string; opacity: string } {
  if (count === 0) return { bg: '', opacity: '0' };
  
  const percentage = count / totalParticipants;
  // Using primary color #6e56cf with varying opacity
  return {
    bg: 'bg-primary',
    opacity: `${Math.min(percentage, 0.8)}`, // Max 80% opacity to keep it readable
  };
}