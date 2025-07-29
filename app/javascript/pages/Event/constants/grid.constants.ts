export const GRID_CONSTANTS = {
  CONTAINER_CLASSES: 'h-full flex flex-col',
  CALENDAR_GRID_CLASSES: 'border border-gray-200 rounded-lg overflow-hidden flex-1',
  DAYS_CONTAINER_CLASSES: 'flex-1 flex',
  FOOTER_CLASSES: 'mt-6 flex items-start justify-between',
  CLEAR_BUTTON_CLASSES: 'ml-3 text-sm text-blue-600 hover:text-blue-700',
} as const;

export const GRID_MESSAGES = {
  GROUP_AVAILABILITY: 'Group Availability',
  SELECT_AVAILABILITY: 'Select your availability',
  DRAG_INSTRUCTION: 'Click and drag to toggle time slots',
  SLOTS_SELECTED: (count: number) => `${count} time slots selected`,
  CLEAR_SELECTION: 'Clear selection',
} as const;