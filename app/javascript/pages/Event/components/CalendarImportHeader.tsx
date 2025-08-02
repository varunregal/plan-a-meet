interface CalendarImportHeaderProps {
  title?: string;
  className?: string;
}

export function CalendarImportHeader({
  title = "Add Your Availability",
  className = "",
}: CalendarImportHeaderProps) {
  return (
    <div className="space-y-1 mb-2">
      <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">
        Click and drag to select the availabilities
      </p>
    </div>
  );
}
