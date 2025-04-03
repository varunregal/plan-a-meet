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

export const userFormSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  password: z.string().min(8, "Password should be at least 8 characters")
})

export type userFormSchemaType = z.infer<typeof userFormSchema>