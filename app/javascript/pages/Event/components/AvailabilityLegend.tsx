export function AvailabilityLegend() {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3">Availability Guide</h4>

      {/* Group Availability Spectrum */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Group Availability
        </p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">0%</span>
          <div className="flex-1 h-6 rounded-md overflow-hidden flex">
            <div className="flex-1 bg-gray-50" />
            <div className="flex-1 bg-primary/10" />
            <div className="flex-1 bg-primary/20" />
            <div className="flex-1 bg-primary/40" />
            <div className="flex-1 bg-primary/60" />
            <div className="flex-1 bg-primary/90" />
          </div>
          <span className="text-xs text-gray-500">100%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Lighter → Darker = More people available
        </p>
      </div>

      {/* Your Selection */}
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-sm bg-gray-100 ring-[2px] ring-orange-300
  ring-inset flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Your selection</p>
          <p className="text-xs text-gray-500">
            Times you've marked as available
          </p>
        </div>
      </div>
    </div>
  );
}
