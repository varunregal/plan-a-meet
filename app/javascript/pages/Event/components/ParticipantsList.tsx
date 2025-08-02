import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Clock } from "lucide-react";
import { ReactNode } from "react";

interface ParticipantProps {
  id: number;
  name: string;
  responded: boolean;
}
function ParticipantActionToolTip({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent className="bg-gray-800 fill-gray-800 text-white">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
export function ParticipantsList() {
  const mockParticipants: ParticipantProps[] = [
    { id: 1, name: "John Smith", responded: true },
    { id: 2, name: "Jane Doe", responded: true },
    { id: 3, name: "Mike Johnson", responded: false },
  ];

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-center">
        <h4 className="text-sm font-medium text-gray-700 underline underline-offset-2">
          {mockParticipants.filter((i) => i.responded).length} of{" "}
          {mockParticipants.length} responded
        </h4>
      </div>

      <div className="space-y-1">
        {mockParticipants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-gray-600">
                {participant.name.charAt(0)}
              </span>
            </div>

            <span className="text-sm text-gray-700 flex-1">
              {participant.name}
            </span>

            {participant.responded ? (
              <ParticipantActionToolTip
                icon={<Check className="h-4 w-4 text-green-500" />}
                text="Responded"
              />
            ) : (
              <ParticipantActionToolTip
                icon={<Clock className="h-3 w-3 text-yellow-500" />}
                text="Invited"
              />
            )}
          </div>
        ))}
      </div>

      {mockParticipants.length > 5 && (
        <button
          className="text-xs text-gray-500 hover:text-gray-700
    transition-colors"
        >
          View all participants →
        </button>
      )}
    </div>
  );
}
