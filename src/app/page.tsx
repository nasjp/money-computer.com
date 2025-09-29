import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ContentCard } from "@/components/content-card";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getPublishedContentMeta } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default async function Home() {
  const published = await getPublishedContentMeta();
  const latest = published[0];
  const feed = latest ? published.slice(1, 4) : published.slice(0, 3);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="border-b border-border bg-accent/20">
        <div className="container mx-auto grid gap-10 px-6 py-16 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              MONEY COMPUTER
            </span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              お金とコンピュータにものすごく興味がある人の読書ノートです。
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              書籍から得たことを検証し、落とし込むために読書ノートをつけています。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="outline">
                <Link href="/notes">全ノートを見る</Link>
              </Button>
            </div>
          </div>
          {latest ? (
            <Link
              href={`/notes/${latest.slug}`}
              className="group block rounded-lg border border-border/80 bg-card/40 p-6 transition hover:border-foreground/40 hover:bg-card"
            >
              <article className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(latest.updatedAt)}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    <span className="transition group-hover:text-primary">
                      {latest.title}
                    </span>
                  </h2>
                  {latest.insight ? (
                    <p className="text-sm leading-relaxed text-muted-foreground transition group-hover:text-muted-foreground/80">
                      {latest.insight}
                    </p>
                  ) : null}
                </div>
                {latest.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {latest.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground transition group-hover:border-foreground/50 group-hover:text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                最近のノート
              </h2>
              <p className="text-sm text-muted-foreground">
                最近更新されたノートです。
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
