import { Navbar } from "@/pages/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
      <Toaster richColors position="top-center" />
    </main>
  );
}
export default RootLayout;
