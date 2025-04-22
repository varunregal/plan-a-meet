import { useForm } from "react-hook-form";
import { userFormSchema, userFormSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { createUser } from "@/api/user";
import { toast } from "sonner";
import { AvailabilityProps, TimeSlotProps } from "@/pages/Event/event.types";
import { useAvailabilityContext } from "../context/AvailabilityContext";
import UserLoginForm from "@/pages/Event/components/UserLoginForm";
import UserAvailability from "@/pages/Event/components/UserAvailability";
import GroupAvailability from "@/pages/Event/components/GroupAvailability";

function AvailabilityHome({
  name,
  url,
  timeSlots,
}: {
  name: string;
  url: string;
  timeSlots: TimeSlotProps[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { userId, dispatch } = useAvailabilityContext();

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
      dispatch({ type: "SET_USER", payload: response.data.user.id });
      const userTimeSlots = response.data.availability.map(
        (item: AvailabilityProps) => item.time_slot_id
      );
      dispatch({ type: "SET_USER_TIME_SLOTS", payload: userTimeSlots });
    } else {
      toast.error(response.message);
    }
  };
  console.log({ userId });
  return (
    <div className="grid grid-cols-2 gap-30">
      {!userId ? (
        <div className="space-y-12">
          <div className="font-bold">Let's plan for {name}</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <UserLoginForm form={form} isLoading={isLoading} />
            </form>
          </Form>
        </div>
      ) : (
        <UserAvailability url={url} eventTimeSlots={timeSlots} />
      )}
      <GroupAvailability url={url} eventTimeSlots={timeSlots} />
    </div>
  );
}

export default AvailabilityHome;
