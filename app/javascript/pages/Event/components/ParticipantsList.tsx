import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEventStore } from "@/stores/eventStore";
import { Check, Clock } from "lucide-react";
import { ReactNode } from "react";

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
  const { participants, setHoveredParticipantId, hoveredSlotId } =
    useEventStore();

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-center">
        <h4 className="text-sm font-medium text-gray-700 underline underline-offset-2">
          Participants
        </h4>
      </div>

      <div className="space-y-1">
        {participants.map((participant) => {
          const isParticipantAvailable =
            hoveredSlotId && participant.slot_ids.includes(hoveredSlotId);
          const shouldStrikethrough = hoveredSlotId && !isParticipantAvailable;
          return (
            <div
              key={participant.id}
              onMouseEnter={() => setHoveredParticipantId(participant.id)}
              onMouseLeave={() => setHoveredParticipantId(null)}
              className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">
                  {participant.name.charAt(0)}
                </span>
              </div>

              <span className="text-sm text-gray-700 flex-1">
                <span
                  className={`${shouldStrikethrough ? "line-through" : ""}`}
                >
                  {participant.name}
                </span>
                {participant.is_current_user && (
                  <span className="text-xs text-gray-500 ml-1">(You)</span>
                )}
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
          );
        })}
      </div>
    </div>
  );
}
