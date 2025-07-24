import { EventProps } from "../event.types";
import InvitePeople from "./InvitePeople";
import ShareEvent from "./ShareEvent";

function EventHeader({ event }: { event: EventProps }) {
  return (
    <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:justify-around items-center">
      <div className="text-lg font-medium">
        Let's plan for{" "}
        <span className="font-bold text-primary">{event.name}</span>
      </div>
      <div className="flex gap-4">
        <InvitePeople event={event} />
        <ShareEvent event={event} />
      </div>
    </div>
  );
}
export default EventHeader;
