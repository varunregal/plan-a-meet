interface CalendarImportHeaderProps {
  title?: string;
  className?: string;
}

export function CalendarImportHeader({ 
  title = "Add Your Availability",
  className = "" 
}: CalendarImportHeaderProps) {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${className}`}>
      {title}
    </h2>
  );
}