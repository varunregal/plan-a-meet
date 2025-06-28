import { EventProps } from "../event.types";
import ShareEvent from "./ShareEvent";

function EventHeader({ event }: { event: EventProps }) {
  return (
    <div className="flex justify-around items-center">
      <div className="text-lg font-medium">
        Let's plan for{" "}
        <span className="font-bold text-purple-700">{event.name}</span>
      </div>
      <ShareEvent event={event} />
    </div>
  );
}
export default EventHeader;
