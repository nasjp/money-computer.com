import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95">
      <div className="container mx-auto flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium tracking-tight text-foreground">
            Money Computer Reading Notes
          </p>
          <p className="text-xs text-muted-foreground">
            洞察・実験・定着を接続する読書ノートリポジトリ。
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link
            href="/contents"
            className="transition-colors hover:text-foreground"
          >
            Contents
          </Link>
          <a
            href="mailto:insights@money-computer.com"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
