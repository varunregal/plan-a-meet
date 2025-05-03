import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "@inertiajs/react";
import ShareEvent from "./components/ShareEvent";
import { EventProps } from "./event.types";

const Confirmation = ({ event }: { event: EventProps }) => {
  const editSlotsUrl = `/events/${event.url}`;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg shadow-xl overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-0">
        <CardHeader className="bg-green-50 dark:bg-green-900/30 p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Slot is Booked!
          </CardTitle>
          {event.name && (
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              For: {event.name}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Thank you for selecting your preferred time slot. We've successfully
            received your choice.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            You will recieve an email when the event is scheduled by the event
            creator.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Need to make changes? You can revisit the event page.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-5 p-6 bg-gray-50 border-t border-gray-200">
          <Button asChild variant="outline">
            <Link href={editSlotsUrl}>View or Change Availability</Link>
          </Button>
          <ShareEvent event={event} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Confirmation;
