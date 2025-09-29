import { SiteHeaderClient } from "@/components/site-header-client";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/search", label: "Search" },
] satisfies ReadonlyArray<{ href: string; label: string }>;

const brandLabel = "お金コンピュータ";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <SiteHeaderClient navItems={navItems} brand={brandLabel} />
    </header>
  );
}
