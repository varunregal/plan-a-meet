import { AuthFooterProps } from "../Auth.types";

function AuthFooter({
  handleAuthClick,
  text,
  redirect,
  label,
  component,
}: AuthFooterProps) {
  return (
    <div className="flex flex-col gap-5">
      {component}
      <div className="text-center text-sm">
        {text}{" "}
        <span
          className="underline cursor-pointer font-medium"
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
