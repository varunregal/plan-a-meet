import axios from "axios";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token":
      document.querySelector('[name="csrf-token"]')?.getAttribute("content") ||
      "",
  },
});
