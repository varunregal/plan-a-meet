import { JSX } from "react";
import { authFooterKeyType } from "../Auth.types";

function AuthFooter({
  handleAuthClick,
  text,
  redirect,
  label,
  component,
}: {
  handleAuthClick: (auth: authFooterKeyType) => void;
  text: string;
  label: string;
  redirect: authFooterKeyType;
  component: JSX.Element;
}) {
  return (
    <div className="flex flex-col gap-5">
      {component}
      <div className="text-center text-sm">
        {text}{" "}
        <span
          className="underline cursor-pointer"
          onClick={() => {
            handleAuthClick(redirect);
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default AuthFooter;
