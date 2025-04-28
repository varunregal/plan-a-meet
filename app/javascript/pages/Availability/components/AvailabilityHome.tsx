import { useForm } from "react-hook-form";
import { userFormSchema, userFormSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { createUser } from "@/api/user";
import { toast } from "sonner";
import {
  AvailabilityProps,
  TimeSlotProps,
  UserProps,
} from "@/pages/Event/event.types";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import UserLoginForm from "@/pages/Event/components/UserLoginForm";
import UserAvailability from "@/pages/Availability/components/UserAvailability";
import GroupAvailability from "@/pages/Availability/components/GroupAvailability";
import { usePage } from "@inertiajs/react";

function AvailabilityHome({
  name,
  url,
  eventTimeSlots,
}: {
  name: string;
  url: string;
  eventTimeSlots: TimeSlotProps[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  console.log(usePage().props);
  const { user, dispatch } = useAvailabilityContext();
  const form = useForm<userFormSchemaType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    const user = {
      name: values.name,
      password: values.password,
      url,
    };
    const response = await createUser(user);
    setIsLoading(false);
    if (response.success) {
      toast.success("User signed in successfully!");

      dispatch({ type: "SET_USER", payload: response.data.user });
      dispatch({ type: "SET_USERS", payload: response.data.users });
      if (Array.isArray(response.data.availability)) {
        dispatch({
          type: "SET_USER_TIME_SLOTS",
          payload: response.data.availability,
        });
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20">
      {!user?.id ? (
        <div className="space-y-12">
          <div className="font-bold">Let's plan for {name}</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <UserLoginForm form={form} isLoading={isLoading} />
            </form>
          </Form>
        </div>
      ) : (
        <UserAvailability url={url} eventTimeSlots={eventTimeSlots} />
      )}
      <GroupAvailability url={url} eventTimeSlots={eventTimeSlots} />
    </div>
  );
}

export default AvailabilityHome;
