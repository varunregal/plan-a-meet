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
      <div className="border border-purple-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="font-medium text-gray-900">
            Save your availability and get notified
          </p>
          <p className="text-sm text-muted-foreground">
            Sign up or log in to save your availability, get email notifications
            when the meeting scheduled, and sync with your calendar.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Button
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
