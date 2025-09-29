import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SearchPanel } from "@/components/search-panel";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "検索 | Money Computer Reading Notes",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-accent/20">
        <div className="container mx-auto px-6 py-16">
          <div className="space-y-4 text-balance">
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Search Notes
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              キーワードで読書ノートを横断検索
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              公開中のMDXノート全文を DuckDB + lindera
              でインデックス化しています。洞察や引用、タグなど任意のテキストで検索できます。
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
