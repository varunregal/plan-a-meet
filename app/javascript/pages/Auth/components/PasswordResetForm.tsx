import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";

export function PasswordResetForm({
  isModal,
  onSuccess,
}: {
  isModal?: boolean;
  onSuccess?: () => void;
}) {
  const { data, setData, post, processing, errors } = useForm({
    email_address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/passwords", {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {!isModal && (
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>
      )}

      <div className="grid gap-7">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email_address}
            placeholder="john@planameet.com"
            onChange={(e) => setData("email_address", e.target.value)}
            required
          />
          {errors.email_address && (
            <p className="text-red-500 text-sm">{errors.email_address}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? "Sending..." : "Send reset link"}
        </Button>

        {(errors as any).base && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{(errors as any).base}</span>
          </div>
        )}
      </div>
    </form>
  );
}