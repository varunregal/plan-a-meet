import { useForm } from "react-hook-form";
import { userFormSchema, userFormSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { createUser } from "@/api/user";
import { toast } from "sonner";
import UserLoginForm from "./components/UserLoginForm";
import UserAvailability from "./components/UserAvailability";
import GroupAvailability from "./components/GroupAvailability";
import { AvailabilityProps, TimeSlotProps, UserProps } from "./event.types";

function Show({
  name,
  url,
  timeSlots,
}: {
  name: string;
  url: string;
  timeSlots: TimeSlotProps[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});
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
      toast.success("User created successfully!");
      setUserData(response.data);
    } else {
      toast.error(response.message);
    }
  };
  function groupAvailabilitySlots(availabilities: AvailabilityProps[]) {
    console.log(availabilities)
    availabilities.reduce((acc: any, current: any) => {
      acc[current.user_id] = acc[current.user_id] || [];
      acc[current.user_id].push(current.time_slot_id);
      return acc;
    }, {});
  }
  return (
    <div className="grid grid-cols-2 gap-30">
      {Object.keys(userData).length === 0 ? (
        <div className="space-y-12">
          <div className="font-bold">Let's plan for {name}</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <UserLoginForm form={form} isLoading={isLoading} />
            </form>
          </Form>
        </div>
      ) : (
        <UserAvailability
          timeSlots={timeSlots}
          userSelectedSlots={userData?.availability.map(
            (item: AvailabilityProps) => item.time_slot_id
          )}
          url={url}
          userId={userData?.user?.id}
        />
      )}
      <GroupAvailability timeSlots={timeSlots} url={url}/>
    </div>
  );
}

export default Show;
