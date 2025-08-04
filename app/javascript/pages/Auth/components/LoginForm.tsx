import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { PasswordResetDialog } from "./PasswordResetDialog";

export function LoginForm({
  isModal,
  onSuccess,
}: {
  isModal?: boolean;
  onSuccess?: () => void;
}) {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    email_address: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/session", {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {!isModal && (
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the email and password below to login
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
            <p className="text-red-500">{errors.email_address}</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="ml-auto text-sm underline-offset-4 underline"
            >
              Forgot your password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <Button type="submit" className="w-full">
          {processing ? "Signing in..." : "Sign in"}
        </Button>

        {(errors as any).base && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{(errors as any).base}</span>
          </div>
        )}
      </div>
    </form>
    
      <PasswordResetDialog
        open={showPasswordReset}
        onOpenChange={setShowPasswordReset}
      />
    </>
  );
}
