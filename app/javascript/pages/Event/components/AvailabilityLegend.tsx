export function AvailabilityLegend() {
  const legendItems = [
    {
      color: "bg-primary",
      label: "Your selection",
      description: "Time slots you've selected",
    },
    {
      color: "bg-green-100 border-2 border-green-300",
      label: "Group Availability",
      description: "Others are available",
    },
    {
      color: "bg-gray-100",
      label: "No responses",
      description: "No one has marked this slot",
    },
    {
      color: "bg-primary opacity-50 border-2 border-dashed border-primary",
      label: "Unsaved selection",
      description: "Your pending changes",
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
      <div className="space-y-4">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 ${item.color}`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
