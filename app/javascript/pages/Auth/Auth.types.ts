import { JSX } from "react";

export type authFooterKeyType = "sign_in" | "sign_up" | "guest";
export type authFooterValueType = {
  text: string;
  label: string;
  redirect: authFooterKeyType;
  component: JSX.Element;
};