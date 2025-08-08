import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Participant, useEventStore } from "@/stores/eventStore";
import { Check, Clock, Mail, X } from "lucide-react";
import { ReactNode } from "react";
import { EventProps } from "../event.types";
import { useFetchAvailability } from "../utils/useFetchAvailability";
import { Skeleton } from "@/components/ui/skeleton";
function ParticipantActionToolTip({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div tabIndex={0}>{icon}</div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-800 fill-gray-800 text-white capitalize">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function ParticipantInvitationStatus({
  invitation_status,
}: {
  invitation_status: Participant["invitation_status"];
}) {
  return (
    <div
      className="flex gap-1 cursor-pointer"
      style={{ pointerEvents: "auto" }}
    >
      <Mail className="h-4 w-4 text-gray-300" />
      {invitation_status === "pending" && (
        <Clock className="h-4 w-4 text-yellow-500" />
      )}
      {invitation_status === "accepted" && (
        <Check className="h-4 w-4 text-green-500" />
      )}
      {invitation_status === "declined" && (
        <X className="h-4 w-4 text-red-500" />
      )}
    </div>
  );
}

function ParticipantsListSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-center">
        <h4 className="text-sm font-medium text-gray-700 underline underline-offset-2">
          Participants
        </h4>
      </div>
      <div className="space-y-1">
        {/* Render 3 skeleton participant items */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 py-1.5 px-2 rounded"
          >
            {/* Avatar skeleton */}
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />

            {/* Name skeleton */}
            <Skeleton className="h-4 flex-1 max-w-[120px]" />

            {/* Status icon skeleton */}
            <Skeleton className="w-4 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function checkForPendingOrDeclined(
  invitation_status: Participant["invitation_status"],
) {
  return invitation_status === "pending" || invitation_status === "declined";
}
function ParticipantsList({
  event,
  currentUserId,
}: {
  event: EventProps;
  currentUserId: string;
}) {
  const setHoveredParticipantId = useEventStore(
    (state) => state.setHoveredParticipantId,
  );
  const { data, isLoading } = useFetchAvailability({ event, currentUserId });

  if (isLoading) return <ParticipantsListSkeleton />;

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-center">
        <h4 className="text-sm font-medium text-gray-700 underline underline-offset-2">
          Participants
        </h4>
      </div>
      <div className="space-y-1">
        {data.participants.map((participant: Participant) => (
          <div
            key={participant.id}
            onMouseEnter={() =>
              !checkForPendingOrDeclined(participant.invitation_status) &&
              setHoveredParticipantId(participant.id)
            }
            onMouseLeave={() =>
              !checkForPendingOrDeclined(participant.invitation_status) &&
              setHoveredParticipantId(null)
            }
            className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-gray-600">
                {participant.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-700 flex-1">
              <span>{participant.name}</span>
              {participant.is_current_user && (
                <span className="text-xs text-gray-500 ml-1">(You)</span>
              )}
            </span>
            {participant.responded && !participant.invitation_status && (
              <ParticipantActionToolTip
                icon={<Check className="h-4 w-4 text-green-500" />}
                text="Responded"
              />
            )}
            {participant.invitation_status && (
              <ParticipantActionToolTip
                icon={
                  <ParticipantInvitationStatus
                    invitation_status={participant.invitation_status}
                  />
                }
                text={participant.invitation_status}
              />
            )}
          </div>
        ))}
        {data.participants.length === 0 && (
          <p className="text-muted-foreground text-xs text-center">
            No active participants currently.
          </p>
        )}
      </div>
    </div>
  );
}
export default ParticipantsList;
