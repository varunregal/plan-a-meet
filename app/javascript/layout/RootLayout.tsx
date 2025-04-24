import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Toaster richColors position="top-center" />
    </div>
  );
}
export default RootLayout;
