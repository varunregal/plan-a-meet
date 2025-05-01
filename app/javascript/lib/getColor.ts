export function getSlotColor(
  frequency: number,
  maxFrequency: number,
): string {
  
  const freq = Math.max(0, Math.min(frequency, maxFrequency));
  const t    = maxFrequency > 0 ? freq / maxFrequency : 0;

  if(freq === 0){
    return "oklch(96.7% 0.003 264.542)"
  }

  const H = 275;      
  const S = 60;       

  const L0 = 90;
  const L1 = 40;
  const L  = L0 - t * (L0 - L1);

  return `hsl(${H}, ${S}%, ${L}%)`;
}