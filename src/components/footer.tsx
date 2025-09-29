import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/contents", label: "Contents" },
  { href: "/search", label: "Search" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95">
      <div className="container mx-auto flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium tracking-tight text-foreground">
            お金コンピュータ
          </p>
          <p className="text-xs text-muted-foreground">
            お金とコンピュータにものすごく興味がある人の読書ノートです。
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
