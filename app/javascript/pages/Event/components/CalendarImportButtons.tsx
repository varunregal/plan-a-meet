import { Calendar } from "lucide-react";
import { memo } from "react";

interface CalendarImportButtonsProps {
  onImport?: (provider: 'google' | 'outlook') => void;
}

const BUTTON_CLASSES = "flex flex-col gap-1 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 hover:bg-purple-50 transition-colors text-center";

export const CalendarImportButtons = memo(({ onImport }: CalendarImportButtonsProps) => {
  const handleGoogleImport = () => {
    onImport?.('google');
  };

  const handleOutlookImport = () => {
    onImport?.('outlook');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        className={BUTTON_CLASSES}
        onClick={handleGoogleImport}
        type="button"
      >
        <Calendar className="w-6 h-6 mx-auto text-gray-400" />
        <p className="text-sm font-medium text-gray-900">
          Import from Google Calendar
        </p>
        <p className="text-xs text-gray-600">See your busy times</p>
      </button>
      <button
        className={BUTTON_CLASSES}
        onClick={handleOutlookImport}
        type="button"
      >
        <Calendar className="w-6 h-6 mx-auto text-gray-400" />
        <p className="text-sm font-medium text-gray-900">
          Import from Outlook Calendar
        </p>
        <p className="text-xs text-gray-600">Sync your calendar</p>
      </button>
    </div>
  );
});
