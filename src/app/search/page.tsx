import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SearchPanel } from "@/components/search-panel";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "検索",
  description:
    "公開中の読書ノート全文をインデックス化し、キーワードで横断検索できます。",
  openGraph: {
    title: "検索",
    description:
      "公開中の読書ノート全文をインデックス化し、キーワードで横断検索できます。",
  },
};

export default function SearchPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader activeNav="search" />
      <section className="border-b border-border bg-accent/20">
        <div className="container mx-auto px-6 py-16">
          <div className="space-y-4 text-balance">
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Search Notes
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              キーワードでノートを横断検索
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              公開中のノート全文をインデックス化しています。キーワードやタグなど任意のテキストで検索できます。
            </p>
          </div>
          <div className="mt-10">
            <SearchPanel />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
