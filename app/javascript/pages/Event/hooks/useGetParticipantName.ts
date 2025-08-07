import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePage } from "@inertiajs/react";
import { EventProps, UserProps } from "../event.types";
import api from "@/lib/api";

export function useGetParticipantName() {
  const { current_user } = usePage().props;
  const [participantName, setParticipantName] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const isAnonymous = !current_user;

  useEffect(() => {
    if (isAnonymous) {
      const cookies = document.cookie.split(";");
      const nameCookie = cookies.find((c) =>
        c.trim().startsWith("participant_name="),
      );
      if (nameCookie) {
        const name = decodeURIComponent(nameCookie.split("=")[1]);
        setParticipantName(name);
      }
    }
  }, [isAnonymous]);

  return {
    participantName,
  };
}
