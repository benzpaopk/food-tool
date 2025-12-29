"use client";

/**
 * Application Sidebar Navigation
 * 
 * Responsive sidebar navigation for the Food Cost Calculator app.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ChefHat, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Ingredients",
    href: "/ingredients",
    icon: Utensils,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: ChefHat,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all min-h-[48px]",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
            )}
          >
            <item.icon className="h-6 w-6" aria-hidden="true" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:border-r">
        <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto bg-background">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <h1 className="text-2xl font-bold">Food Cost Calculator</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <NavLinks />
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-20 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Food Cost Calculator</h1>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-3 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

