import { useForm } from "react-hook-form";
import { userFormSchema, userFormSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { createUser } from "@/api/user";
import { toast } from "sonner";
import UserLoginForm from "./components/UserLoginForm";
import UserAvailability from "./components/UserAvailability";
import GroupAvailability from "./components/GroupAvailability";
import prepareTimeSlots from "@/lib/prepareTimeSlots";

function Show({
  name,
  url,
  timeSlots,
}: {
  name: string;
  url: string;
  timeSlots: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState("");
  const form = useForm<userFormSchemaType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  useEffect(() => {
    prepareTimeSlots(timeSlots);
  }, [timeSlots]);

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
      setUser(response.data);
    } else {
      toast.error(response.message);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {!user ? (
        <div className="space-y-12">
          <div className="font-bold">Let's plan for {name}</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <UserLoginForm form={form} isLoading={isLoading} />
            </form>
          </Form>
        </div>
      ) : (
        <UserAvailability />
      )}
      <GroupAvailability timeSlots={timeSlots} />
    </div>
  );
}

export default Show;
