import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

function ButtonWithLoader({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

export default ButtonWithLoader;
