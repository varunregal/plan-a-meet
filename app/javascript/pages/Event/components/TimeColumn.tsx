interface TimeColumnProps {
  hours: number[];
  formatHour: (hour: number) => string;
}

export function TimeColumn({ hours, formatHour }: TimeColumnProps) {
  return (
    <div className="w-20 border-r border-gray-200 ">
      <div className="h-16 border-b border-gray-200" />

      {hours.map((hour) => (
        <div
          key={hour}
          className="h-20 border-b border-gray-200 flex items-center justify-center"
        >
          <span className="text-sm text-gray-600 font-semibold">
            {formatHour(hour).replace(":00", "")}
          </span>
        </div>
      ))}
    </div>
  );
}
