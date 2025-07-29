import { memo } from 'react';

const OPACITY_LEVELS = [0.2, 0.4, 0.6, 0.8] as const;

export const AvailabilityLegend = memo(() => {
  return (
    <div className="text-right">
      <div className="text-sm text-gray-600 mb-2">Availability</div>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex gap-1 items-center">
          {OPACITY_LEVELS.map((opacity) => (
            <div
              key={opacity}
              className="w-4 h-4 bg-primary rounded"
              style={{ opacity }}
            />
          ))}
        </div>
        <span className="text-gray-500">Fewer → More people</span>
      </div>
    </div>
  );
});