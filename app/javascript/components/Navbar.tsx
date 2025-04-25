import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, router } from "@inertiajs/react";

type MenuLink = { label: string; href: string };

const menuLinks: MenuLink[] = [
  { label: "Create a Meet", href: "#" },
  { label: "How it works", href: "#" },
  { label: "Notifications", href: "#" },
];

export function Navbar() {
  return (
    <header className="w-full px-5 md:px-10">
      <div className="container mx-auto flex h-16 items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">Plan A Meeting</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-2 gap-6">
          {menuLinks.map((menuLink: MenuLink) => (
            <Link
              key={menuLink.label}
              href={menuLink.href}
              className="text-sm font-medium"
            >
              {menuLink.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex items-right justify-end gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/users/sign_in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/users/sign_up">Sign up</Link>
            </Button>
            <Button
              onClick={() =>
                router.delete("users/sign_out", {
                  onSuccess: () => {
                    router.visit("/users/sign_up");
                  },
                  onError: () => {
                    console.log("Something went wrong");
                  },
                })
              }
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost">
                <Menu />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-10">
              <nav className="grid gap-4 text-center">
                {menuLinks.map((menuLink: MenuLink) => (
                  <Link
                    key={menuLink.label}
                    href={menuLink.href}
                    className="text-sm font-medium py-2"
                  >
                    {menuLink.label}
                  </Link>
                ))}

                <div className="grid grid-cols-2 gap-2 p-5 border-t border-gray-200">
                  <Button variant="outline" asChild>
                    <Link href="/users/sign_in">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/users/sign_up">Sign up</Link>
                  </Button>
                  <Button>Logout</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
