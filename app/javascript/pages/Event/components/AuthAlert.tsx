import { Button } from "@/components/ui/button";
import { AuthModal } from "@/pages/Auth/components/AuthModal";
import { usePage } from "@inertiajs/react";
import { Info } from "lucide-react";
import { useState } from "react";

export function AuthAlert() {
  const [defaultTab, setDefaultTab] = useState<"login" | "signup">("signup");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { current_user } = usePage().props;

  if (current_user) return null;

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-start md:items-center">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-gray-900">
              Save your availability and get notified
            </p>
            <p className="text-sm text-muted-foreground">
              Sign up or log in to save your availability, get email
              notifications when the meeting scheduled, and sync with your
              calendar.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={"secondary"}
              onClick={() => {
                setShowAuthModal(true);
                setDefaultTab("signup");
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAuthModal(true);
                setDefaultTab("login");
              }}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab={defaultTab}
      />
    </>
  );
}
