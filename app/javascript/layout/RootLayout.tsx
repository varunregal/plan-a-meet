import { Navbar } from "@/pages/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { AvailabilityProvider } from "@/pages/Availability/context/AvailabilityContext";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AvailabilityProvider>
      <main className="max-w-[1440px] mx-auto h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Toaster richColors position="top-center" />
      </main>
    </AvailabilityProvider>
  );
}
export default RootLayout;
