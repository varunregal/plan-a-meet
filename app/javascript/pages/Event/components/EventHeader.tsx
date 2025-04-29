import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EventProps } from "../event.types";

function EventHeader({ event }: { event: EventProps }) {
  const handleCopyEventURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied to the Clipboard!");
    } catch (error) {
      console.error(`Failed to copy Event URL: ${event.url}`, error);
      toast.error("Failed to copy the Event URL");
    }
  };
  return (
    <div className="flex justify-between items-center">
      <div className="text-lg font-medium">
        Let's plan for{" "}
        <span className="font-bold text-purple-700">{event.name}</span>
      </div>
      <Button variant="outline" onClick={handleCopyEventURL}>
        Share Event
      </Button>
    </div>
  );
}
export default EventHeader;
