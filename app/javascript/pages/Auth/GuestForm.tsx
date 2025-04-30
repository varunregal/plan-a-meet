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
      <div className="flex flex-col gap-5 border-[1px] border-gray-200 shadow-sm p-8 rounded-md">
        <div className="font-medium text-lg">Continue as Guest</div>
        <div className="grid gap-7">
          <div className="grid gap-2">
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
