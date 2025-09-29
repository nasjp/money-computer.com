"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteHeaderClientProps = {
  navItems: ReadonlyArray<{
    href: string;
    label: string;
  }>;
  brand: string;
};

export function SiteHeaderClient({ navItems, brand }: SiteHeaderClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleNavigate = () => setOpen(false);
  const isItemActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.24em]"
          >
            {brand}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={handleToggle}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground",
                  )}
                  onClick={handleNavigate}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
