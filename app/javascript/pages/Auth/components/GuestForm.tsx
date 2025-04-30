import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestFormSchema, guestFormSchemaType } from "@/lib/schema";
import { Link, router, usePage } from "@inertiajs/react";

export function GuestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<guestFormSchemaType>({
    resolver: zodResolver(guestFormSchema),
  });

  return (
    <form>
      <div className="flex flex-col gap-5 text-center">
        <div className="font-bold text-2xl">Continue as Guest</div>
        <div className="grid gap-7">
          <div className="grid gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              placeholder="Enter your name"
              required
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-red-500">{errors.name?.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Sign in as Guest
          </Button>
        </div>
      </div>
    </form>
  );
}
