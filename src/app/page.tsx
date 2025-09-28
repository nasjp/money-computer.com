import Link from "next/link";

import { ContentCard } from "@/components/content-card";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  type ContentMeta,
  getPinnedContentMeta,
  getPublishedContentMeta,
} from "@/lib/content";
import { formatDate } from "@/lib/date";

function splitFeed(meta: ContentMeta[], pinned: ContentMeta[]) {
  const pinnedSlugs = new Set(pinned.map((item) => item.slug));
  return meta.filter((item) => !pinnedSlugs.has(item.slug));
}

export default async function Home() {
  const [pinned, published] = await Promise.all([
    getPinnedContentMeta(),
    getPublishedContentMeta(),
  ]);

  const feed = splitFeed(published, pinned);
  const latest = feed[0] ?? pinned[0];

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-accent/20">
        <div className="container mx-auto grid gap-10 px-6 py-16 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              Reading Strategy Ops
            </span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              洞察→実験→定着を接続する読書ノートの公開フィード
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              書籍から得た洞察を即座にフィールドで検証し、勝率・期待値・試行回数のレバーへ落とし込むための
              ノートをMDXで管理しています。最新のインサイトとPlaybookをフィードで追いかけましょう。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contents">全コンテンツを見る</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`/contents/${latest?.slug ?? ""}`}>
                  最新ノートへ移動
                </Link>
              </Button>
            </div>
          </div>
          {latest ? (
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>最近更新</span>
                <span>{formatDate(latest.updatedAt)}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">
                {latest.title}
              </h2>
              {latest.insight ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {latest.insight}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2">
                {latest.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                ピン留めされた洞察
              </h2>
              <p className="text-sm text-muted-foreground">
                戦略・顧客理解・価格設計など、レバーに直結する基本ノート。
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contents">一覧へ</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pinned.map((content) => (
              <ContentCard
                key={content.slug}
                content={content}
                highlightInsight
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                最新フィード
              </h2>
              <p className="text-sm text-muted-foreground">
                更新順で公開ノートを表示。ピン留め以外のアップデートはこちらから。
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {feed.map((content) => (
              <ContentCard key={content.slug} content={content} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
