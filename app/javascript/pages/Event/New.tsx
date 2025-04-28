import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectTime from "./components/SelectTime";
import SelectDates from "./components/SelectDates";
import { createEvent } from "@/api/event";
import { EventResponseProps } from "./event.types";
import { eventFormSchema, eventFormSchemaType } from "@/lib/schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import ButtonWithLoader from "./components/ButtonWithLoader";
import { Button } from "@/components/ui/button";

function New() {
  const { flash }: any = usePage().props;
  console.log(usePage().props);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<eventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      dates: [],
      start_time: "9",
      end_time: "17",
    },
  });

  const onSubmit = async (values: eventFormSchemaType) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const event = {
      name: values.name,
      dates: values.dates,
      start_time: values.start_time,
      end_time: values.end_time,
      time_zone: timeZone,
    };
    router.post("/events", { event });
    // console.log(values.dates[0].toISOString());
    // setIsLoading(true);
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // const event = {
    //   name: values.name,
    //   dates: [],
    //   start_time: values.start_time,
    //   end_time: values.end_time,
    //   time_zone: timeZone,
    // };
    // console.log(event);
    // const response: EventResponseProps = await createEvent(event);
    // setIsLoading(false);
    // if (response.success) {
    //   if (response.data)
    //     router.visit(`/events/${response.data.url}`, {
    //       method: "get",
    //     });
    // } else {
    //   toast.error(response.message);
    // }
  };
  return (
    <div className="px-8 mt-20 w-full md:w-2/3 lg:w-1/2 mx-auto">
      <div className="text-center flex flex-col gap-1 mb-15">
        <h2 className="font-bold text-lg">Create a New Meeting</h2>
        <p className="text-muted-foreground text-sm">
          Schedule meeting with others efficiently
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10 items-center w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Event name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Eg. Team Lunch"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-10 w-full">
            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => <SelectDates field={field} />}
            />
            <div className="flex flex-col gap-5">
              <div className="text-sm font-medium">
                What times work for you?
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectTime
                  form={form}
                  name={"start_time"}
                  placeholder="Select start time"
                  label="Start time"
                />

                <SelectTime
                  form={form}
                  name={"end_time"}
                  placeholder="Select end time"
                  label="End time"
                />
              </div>
            </div>
          </div>
          <ButtonWithLoader isLoading={isLoading}>
            Create Event
          </ButtonWithLoader>
        </form>
      </Form>
    </div>
  );
}

export default New;
