import { Button } from "@/components/ui/button";
import { TimeSlotProps, UserProps } from "./event.types";

function EventHeader({
  name,
  creatorName,
}: {
  name: string;
  creatorName?: string;
}) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
          {creatorName && (
            <p className="text-sm text-muted-foreground">
              Created by {creatorName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant={"outline"}>Invite People</Button>
          <Button>Copy Link</Button>
        </div>
      </div>
    </div>
  );
}
function EventShow({
  id,
  name,
  event_creator,
  is_creator,
  time_slots,
}: {
  id: number;
  name: string;
  event_creator: UserProps;
  is_creator: boolean;
  time_slots: TimeSlotProps[];
}) {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <EventHeader name={name} creatorName={event_creator.name} />
      </div>
    </div>
  );
}

export default EventShow;
