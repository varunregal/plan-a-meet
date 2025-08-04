import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordResetForm } from "./PasswordResetForm";
// import { toast } from "sonner";

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordResetDialog({
  open,
  onOpenChange,
}: PasswordResetDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    // toast.message("Check your email", {
    //   description:
    //     "If an account exists, we've sent password reset instructions.",
    // });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your
            password
          </DialogDescription>
        </DialogHeader>
        <PasswordResetForm isModal onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
