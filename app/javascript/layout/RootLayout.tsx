import { Navbar } from "@/pages/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { AvailabilityProvider } from "@/pages/Availability/context/AvailabilityContext";

function RootLayout({ children }: { children: ReactNode }) {
  const pathname = window.location.pathname;
  const isCredentialsPage =
    pathname.includes("/session") || pathname.includes("/registration");
  return (
    <AvailabilityProvider>
      <main>
        <Navbar />
        <div
          className={`${
            !isCredentialsPage ? "px-8 md:px-15 mt-20 w-full mx-auto" : ""
          }`}
        >
          {children}
        </div>
        <Toaster richColors position="top-center" />
      </main>
    </AvailabilityProvider>
  );
}
export default RootLayout;
