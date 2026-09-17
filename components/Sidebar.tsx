"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Radio, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const routes = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Connect Camera", path: "/connect", icon: Video },
  { name: "Live Feeds", path: "/live/cam-1", icon: Radio }, // Hardcoded for prototype
];

export function Sidebar() {
  const pathname = usePathname();

  const NavLinks = () => (
    <nav className="space-y-1">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname === route.path || (route.path.startsWith("/live") && pathname.startsWith("/live"));
        
        return (
          <Link
            key={route.path}
            href={route.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {route.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetTitle className="text-xl font-semibold tracking-tight mb-6">Drizzy</SheetTitle>
          <NavLinks />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-muted/30 h-screen sticky top-0 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Video className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Drizzy</h1>
        </div>
        <NavLinks />
      </aside>
    </>
  );
}
