import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Users, Link as LinkIcon, Check } from "lucide-react";
import { AuthModal } from "../Auth/components/AuthModal";
import { Badge } from "@/components/ui/badge";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

interface ShowProps {
  id: number;
  name: string;
  is_creator: boolean;
  time_slots: TimeSlot[];
}

export default function Show({ id, name, is_creator, time_slots }: ShowProps) {
  const { props } = usePage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const currentUser = props.current_user;

  // Group time slots by date
  const slotsByDate = time_slots.reduce(
    (acc, slot) => {
      const date = format(new Date(slot.start_time), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>,
  );

  const handleSlotToggle = (slotId: number) => {
    if (!currentUser && !is_creator) {
      setShowAuthModal(true);
      return;
    }

    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId],
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          {is_creator && (
            <Badge variant="secondary" className="ml-2">
              <Users className="w-3 h-3 mr-1" />
              Organizer
            </Badge>
          )}
        </div>

        {is_creator && (
          <Card className="mb-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Share this event</p>
                  <p className="text-sm text-muted-foreground">
                    Send this link to participants
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={copyLink}>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Anonymous Creator Message */}
      {is_creator && !currentUser && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Save Your Event</CardTitle>
            <CardDescription>
              Sign in to manage this event, see responses, and send reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto"
            >
              Sign In to Claim Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Time Slots Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Available Times</CardTitle>
          <CardDescription>
            Click on the time slots when you're available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </h3>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotToggle(slot.id)}
                        className={cn(
                          "p-2 text-sm rounded-md border transition-all",
                          "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-input hover:bg-muted",
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <Clock className="w-3 h-3 mb-1" />
                          <span className="text-xs">
                            {format(new Date(slot.start_time), "h:mm a")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedSlots.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedSlots.length} time slot
                {selectedSlots.length !== 1 ? "s" : ""} selected
              </p>
              <Button>
                <Check className="w-4 h-4 mr-2" />
                Save Availability
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authentication Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab={is_creator ? "login" : "signup"}
        title={is_creator ? "Sign in to manage your event" : "Join this event"}
        description={
          is_creator
            ? "Sign in or create an account to manage responses and finalize the event time"
            : "Create an account or sign in to mark your availability"
        }
      />
    </div>
  );
}
