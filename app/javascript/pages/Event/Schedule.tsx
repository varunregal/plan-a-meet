import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { EventProps, TimeSlotProps } from "./event.types";

export default function EventScheduledPage({
  event,
  scheduled_slots,
}: {
  event: EventProps;
  scheduled_slots: TimeSlotProps[];
}) {
  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pt-6">
          <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
          <CardTitle className="mt-4 text-lg">Event Scheduled</CardTitle>
          <CardDescription className="mt-2">
            "{event.name}" has been scheduled successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-md font-medium">Confirmed Time Slots</h3>
            <ul className="space-y-2">
              {scheduled_slots.map((slot: any) => (
                <li
                  key={slot.id}
                  className="flex text-sm justify-between bg-white p-3 rounded-md shadow-sm"
                >
                  <span>
                    {format(new Date(slot.start_time), "PPP p")} -{" "}
                    {format(new Date(slot.end_time), "p")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <div className="px-6 pb-6 text-right">
          <Button asChild>
            <a href={`/events/${event.url}`}>Back to Event</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
