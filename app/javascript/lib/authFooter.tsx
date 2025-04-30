import {
  authFooterKeyType,
  authFooterValueType,
} from "@/pages/Auth/Auth.types";
import { GuestForm } from "@/pages/Auth/components/GuestForm";
import { LoginForm } from "@/pages/Auth/components/LoginForm";
import { SignupForm } from "@/pages/Auth/components/SignupForm";

export const authFooter: Record<authFooterKeyType, authFooterValueType> = {
  sign_in: {
    text: "Don't have an account?",
    label: "Sign up",
    redirect: "sign_up",
    component: <LoginForm />,
  },
  sign_up: {
    text: "Continue as Guest",
    label: "Guest",
    redirect: "guest",
    component: <SignupForm />,
  },
  guest: {
    text: "Already have an account?",
    label: "Login",
    redirect: "sign_in",
    component: <GuestForm />,
  },
};
