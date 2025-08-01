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
import { eventFormSchema, eventFormSchemaType } from "@/lib/schema";
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import ButtonWithLoader from "./components/ButtonWithLoader";
import { toast } from "sonner";
import { format } from "date-fns";
import { TimezoneSelect } from "./components/TimeZoneSelect";

function New() {
  const { flash }: any = usePage().props;
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<eventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      dates: [],
      start_time: "9",
      end_time: "17",
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  useEffect(() => {
    if (flash.success) toast.success(flash.success);
    else if (flash.error) toast.error(flash.error);
  }, [flash]);

  const onSubmit = async (values: eventFormSchemaType) => {
    setIsLoading(true);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const event = {
      name: values.name,
      dates: values.dates.map((date) => format(date, "yyyy-MM-dd")),
      start_time: values.start_time.padStart(2, "0") + ":00",
      end_time: values.end_time.padStart(2, "0") + ":00",
      time_zone: timeZone,
    };
    console.log({ event });
    router.post(
      "/events",
      { ...event },
      {
        onFinish: () => {
          setIsLoading(false);
        },
      },
    );
  };
  return (
    <div className="flex h-full justify-center">
      <div className="w-full md:w-3/4 lg:w-2/3 px-5 md:px-0 flex flex-col gap-10">
        <div className="flex flex-col gap-1 items-center">
          <h2 className="font-bold text-lg">Create a New Meeting</h2>
          <p className="text-gray-500 text-sm">
            Schedule meeting with others efficiently
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-7 items-center w-full"
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
            <div className="flex flex-col gap-7 w-full">
              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => <SelectDates field={field} />}
              />
              <div className="flex flex-col gap-5">
                <TimezoneSelect form={form} />
                <div className="text-sm font-medium">
                  What times work for you? (Eastern Time Zone)
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
    </div>
  );
}

export default New;
