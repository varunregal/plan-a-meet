import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(5, "Event name should be at least 5 characters"),
  day: z.object({
    from: z.date({
      required_error: "Please select from date",
    }),
    to: z.date({
      required_error: "Please select to date",
    }),
  }),
  start_time: z.string(),
  end_time: z.string(),
});

export type eventFormSchemaType = z.infer<typeof eventFormSchema>;