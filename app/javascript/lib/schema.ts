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
}).refine((data) => {
  return parseInt(data.end_time) > parseInt(data.start_time)
}, {
  message: "End time must be later than Start time",
  path: ["end_time"]
});

export type eventFormSchemaType = z.infer<typeof eventFormSchema>;

export const userFormSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  password: z.string().optional()
})

export type userFormSchemaType = z.infer<typeof userFormSchema>

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password should be at least 8 characters")
})

export type loginFormSchemaType = z.infer<typeof loginFormSchema>