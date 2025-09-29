import type { Metadata } from "next";
import Link from "next/link";

import { ContentCard } from "@/components/content-card";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getPublishedContentMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "ノート",
  description:
    "Playbookに直結する読書ノートをタグや更新日で探せます。公開中のメモを静的生成で高速に閲覧できます。",
  openGraph: {
    title: "ノート",
    description:
      "Playbookに直結する読書ノートをタグや更新日で探せます。公開中のメモを静的生成で高速に閲覧できます。",
  },
};

function getAllTags(meta: Awaited<ReturnType<typeof getPublishedContentMeta>>) {
  const map = new Map<string, number>();
  for (const item of meta) {
    for (const tag of item.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

function parseTagFilter(tagParam: string | string[] | undefined) {
  if (!tagParam) {
    return [];
  }

  if (Array.isArray(tagParam)) {
    return tagParam;
  }

  return tagParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function buildFilterHref(selected: string[], tag: string) {
  const normalized = new Set(selected);
  if (normalized.has(tag)) {
    normalized.delete(tag);
  } else {
    normalized.add(tag);
  }
  const params = new URLSearchParams();
  if (normalized.size > 0) {
    params.set("tag", Array.from(normalized).join(","));
  }
  const queryString = params.toString();
  return queryString.length > 0 ? `/notes?${queryString}` : "/notes";
}

function filterByTags(
  meta: Awaited<ReturnType<typeof getPublishedContentMeta>>,
  tags: string[],
) {
  if (tags.length === 0) {
    return meta;
  }

  return meta.filter((item) => tags.every((tag) => item.tags.includes(tag)));
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    tag?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const meta = await getPublishedContentMeta();
  const allTags = getAllTags(meta);
  const tagFilter = parseTagFilter(resolvedSearchParams?.tag);
  const filtered = filterByTags(meta, tagFilter);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader activeNav="notes" />
      <section className="border-b border-border bg-accent/20">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Notes Library
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                ノート
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                可能な限り週10時間以上を読書・思考・ノートに充てています。文章は読みやすいものであることは絶対に心がけません。
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">
                {filtered.length}件表示中
              </span>
              {tagFilter.length > 0 ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/notes">フィルタをリセット</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-wrap gap-3">
            {allTags.map(({ tag, count }) => {
              const isSelected = tagFilter.includes(tag);
              return (
                <Link
                  key={tag}
                  href={buildFilterHref(tagFilter, tag)}
                  className={
                    isSelected
                      ? "rounded-full border border-primary bg-primary/10 px-4 py-1 text-xs font-medium text-primary"
                      : "rounded-full border border-border/80 px-4 py-1 text-xs text-muted-foreground transition hover:border-foreground/50 hover:text-foreground"
                  }
                >
                  {tag} ({count})
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((content) => (
              <ContentCard key={content.slug} content={content} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
