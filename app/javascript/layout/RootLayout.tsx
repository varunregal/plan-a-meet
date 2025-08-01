import { Navbar } from "@/pages/Navbar";

import { ReactNode, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast, Toaster } from "sonner";

function RootLayout({ children }: { children: ReactNode }) {
  const { flash } = usePage<{ flash: { alert?: string; notice?: string } }>()
    .props;
  useEffect(() => {
    if (flash?.notice) toast.success(flash.notice);
    if (flash?.alert) toast.error(flash.alert);
  }, [flash]);
  return (
    <main className="max-w-[1380px] mx-auto h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Toaster richColors position="top-center" closeButton />
    </main>
  );
}
export default RootLayout;
