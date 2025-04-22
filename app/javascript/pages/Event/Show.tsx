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
import {
  AvailabilityProvider,
  useAvailabilityContext,
} from "../Availability/context/AvailabilityContext";
import AvailabilityHome from "../Availability/components/AvailabilityHome";

function Show({
  name,
  url,
  timeSlots,
}: {
  name: string;
  url: string;
  timeSlots: TimeSlotProps[];
}) {
  return (
    <AvailabilityProvider>
      <AvailabilityHome name={name} url={url} timeSlots={timeSlots} />
    </AvailabilityProvider>
  );
}

export default Show;
