import { Navbar } from "@/pages/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

function RootLayout({ children }: { children: ReactNode }) {
  const pathname = window.location.pathname;
  const isCredentialsPage =
    pathname.includes("/session") || pathname.includes("/registration");
  return (
    <main>
      <Navbar />
      <div
        className={`${!isCredentialsPage ? "px-8 mt-20 w-full mx-auto" : ""}`}
      >
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}
export default RootLayout;
