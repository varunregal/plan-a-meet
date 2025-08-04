import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, router } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface EditPasswordProps {
  token: string;
}

export default function EditPassword({ token }: EditPasswordProps) {
  const { data, setData, patch, processing, errors } = useForm({
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/passwords/${token}`);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <div className="grid gap-7">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              placeholder="Enter new password"
              onChange={(e) => setData("password", e.target.value)}
              required
              minLength={8}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              placeholder="Confirm new password"
              onChange={(e) => setData("password_confirmation", e.target.value)}
              required
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? "Updating..." : "Update password"}
          </Button>

          {(errors as any).base && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{(errors as any).base}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}