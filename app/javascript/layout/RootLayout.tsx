import { Navbar } from "@/pages/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient();

function RootLayout({ children }: { children: ReactNode }) {
  const { flash } = usePage<{ flash: { alert?: string; notice?: string } }>()
    .props;
  useEffect(() => {
    if (flash?.notice) toast.success(flash.notice);
    if (flash?.alert) toast.error(flash.alert);
  }, [flash]);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="max-w-[1380px] mx-auto h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Toaster richColors position="top-center" closeButton />
      </main>
    </QueryClientProvider>
  );
}
export default RootLayout;
