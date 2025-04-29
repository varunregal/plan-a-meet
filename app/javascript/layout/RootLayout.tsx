import { Navbar } from "@/pages/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

function RootLayout({ children }: { children: ReactNode }) {
  const pathname = window.location.pathname;
  const isCredentialsPage =
    pathname.includes("/session") || pathname.includes("/registration");
  console.log(isCredentialsPage);
  return (
    <main>
      <Navbar />
      <div
        className={`${
          !isCredentialsPage
            ? "px-8 mt-20 w-full md:w-2/3 lg:w-1/2 mx-auto"
            : ""
        }`}
      >
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}
export default RootLayout;
