export const GRID_CONSTANTS = {
  CONTAINER_CLASSES: "h-full flex flex-col",
  CALENDAR_GRID_CLASSES:
    "border border-gray-200 rounded-lg overflow-hidden flex-1",
  DAYS_CONTAINER_CLASSES: "flex-1 flex",
  FOOTER_CLASSES: "mt-6 flex items-start justify-between",
  CLEAR_BUTTON_CLASSES: "ml-3 text-sm text-blue-600 hover:text-blue-700",
} as const;

export const GRID_MESSAGES = {
  GROUP_AVAILABILITY: "Group Availability",
  SELECT_AVAILABILITY: "Select your availability",
  DRAG_INSTRUCTION: "Click and drag to toggle time slots",
  SLOTS_SELECTED: (count: number) => `${count} time slots selected`,
  CLEAR_SELECTION: "Clear selection",
} as const;

export const AVAILABILITY_STYLES = [
  { min: 0, max: 0, classes: "text-gray-500 border-gray-200" },
  {
    min: 1,
    max: 25,
    classes: "bg-[#6e56cf]/20 border-[#6e56cf]/20",
  },
  {
    min: 26,
    max: 50,
    classes: "bg-[#6e56cf]/40 border-[#6e56cf]/30",
  },
  {
    min: 51,
    max: 75,
    classes: "bg-[#6e56cf]/50 border-[#6e56cf]/50",
  },
  {
    min: 76,
    max: 99,
    classes: "bg-[#6e56cf]/60 border-[#6e56cf]/70",
  },
  {
    min: 100,
    max: 100,
    classes: "bg-[#6e56cf]/90 border-[#6e56cf]",
  },
];
