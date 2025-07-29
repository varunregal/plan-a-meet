import { memo } from 'react';

interface AvailabilityGridHeaderProps {
  showGroupAvailability: boolean;
}

export const AvailabilityGridHeader = memo(({ showGroupAvailability }: AvailabilityGridHeaderProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900">
        {showGroupAvailability
          ? "Group Availability"
          : "Select your availability"}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Click and drag to toggle time slots
      </p>
    </div>
  );
});