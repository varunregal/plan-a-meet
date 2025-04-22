export function getColor(frequency: number, maxFrequency: number) {
  if (frequency === 0) return `hsl(120, 0%, 95%)`;
  const normalizedFrequency = frequency / maxFrequency;
  const startLightness = 90;
  const endLightness = 30;
  const lightnessRange = startLightness - endLightness;
  const finalLightness = startLightness - (normalizedFrequency * lightnessRange);
  return `hsl(275, 100%, ${finalLightness}%)`;
}

