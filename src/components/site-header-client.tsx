"use client";

import { Menu, Search, X } from "lucide-react";
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
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
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
        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search" className="gap-2">
              <Search className="size-4" />
              検索
            </Link>
          </Button>
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
              const isActive = item.href === pathname;
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
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              asChild
            >
              <Link href="/search" onClick={handleNavigate}>
                <Search className="size-4" />
                検索
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </>
  );
}
