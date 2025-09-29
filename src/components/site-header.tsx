import { Menu, X } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", key: "home" },
  { href: "/notes", label: "Notes", key: "notes" },
  { href: "/search", label: "Search", key: "search" },
] as const;

export type SiteHeaderNavKey = (typeof navItems)[number]["key"];

type SiteHeaderProps = {
  activeNav?: SiteHeaderNavKey;
};

export function SiteHeader({ activeNav }: SiteHeaderProps) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background overscroll-y-none">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-[0.24em]"
              >
                お金コンピュータ
              </Link>
              <nav className="hidden items-center gap-6 md:flex">
                {navItems.map((item) => {
                  const isActive = item.key === activeNav;
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
            <details className="group relative md:hidden">
              <summary className="group -mr-2 flex cursor-pointer items-center rounded-md p-2 text-muted-foreground transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                <Menu className="size-5 group-open:hidden" aria-hidden="true" />
                <X
                  className="hidden size-5 group-open:block"
                  aria-hidden="true"
                />
                <span className="sr-only">ナビゲーションを開閉</span>
              </summary>
              <div className="absolute right-0 top-12 hidden w-56 rounded-md border border-border bg-background p-4 shadow-lg group-open:block">
                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => {
                    const isActive = item.key === activeNav;
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
            </details>
          </div>
        </div>
      </header>
      <div className="h-16" aria-hidden />
    </>
  );
}
