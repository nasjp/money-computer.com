import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { formatDate } from "@/lib/date";
import { renderMarkdownToReact } from "@/lib/markdown";
import {
  getBacklinksForSlug,
  getNoteBySlug,
  getPublishedNoteMeta,
} from "@/lib/note";

export async function generateStaticParams() {
  const meta = await getPublishedNoteMeta();
  return meta.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getPublishedNoteMeta();
  const target = meta.find((item) => item.slug === slug);

  if (!target) {
    return {
      title: "ノートが見つかりません",
    };
  }

  const description = target.description.trim().length
    ? target.description
    : "お金とコンピュータにものすごく興味がある人の読書ノートです。";

  return {
    title: `${target.title} | お金コンピュータ`,
    description,
    openGraph: {
      title: target.title,
      description,
    },
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await getPublishedNoteMeta();
  const target = meta.find((item) => item.slug === slug);

  if (!target) {
    notFound();
  }

  const [detail, backlinks] = await Promise.all([
    getNoteBySlug(slug),
    getBacklinksForSlug(slug),
  ]);

  const metaMap = new Map(meta.map((item) => [item.slug, item]));
  const outbound = detail.outboundReferences
    .map((slug) => metaMap.get(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const referenceLookup: Record<string, string> = {};
  for (const item of meta) {
    referenceLookup[item.slug] = item.slug;
    referenceLookup[item.title] = item.slug;
    referenceLookup[item.title.toLowerCase()] = item.slug;
    referenceLookup[item.bookTitle] = item.slug;
    referenceLookup[item.bookTitle.toLowerCase()] = item.slug;
  }

  const renderedNote = await renderMarkdownToReact(
    detail.body,
    referenceLookup,
  );

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader activeNav="notes" />
      <article>
        <section className="border-b border-border bg-accent/20">
          <div className="container mx-auto grid gap-8 px-6 py-16 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-6">
              <Link
                href="/notes"
                className="text-xs uppercase tracking-[0.32em] text-muted-foreground transition hover:text-foreground"
              >
                Notes
              </Link>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {detail.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{detail.bookTitle}</span>
                {detail.author ? <span>著: {detail.author}</span> : null}
                {detail.publisher ? (
                  <span>出版社: {detail.publisher}</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1">
                  初回: {formatDate(detail.publishedAt)}
                </span>
                <span className="rounded-full border border-border px-3 py-1">
                  更新: {formatDate(detail.updatedAt)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/notes?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground transition hover:border-foreground/50 hover:text-foreground"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="note-body" className="bg-background">
          <div className="container mx-auto grid gap-12 px-6 py-16 lg:grid-cols-[3fr_2fr]">
            <div className="prose prose-neutral max-w-none">{renderedNote}</div>
            <aside className="space-y-10">
              <div className="rounded-xl border border-border/80 bg-card/40 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  関連ノート（参照先）
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {outbound.length > 0 ? (
                    outbound.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/notes/${item.slug}`}
                          className="transition hover:text-foreground"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-muted-foreground/80">
                          最終更新: {formatDate(item.updatedAt)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li>他ノートへの参照はまだありません。</li>
                  )}
                </ul>
              </div>
              <div className="rounded-xl border border-border/80 bg-card/40 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  被リンク（参照元）
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {backlinks.length > 0 ? (
                    backlinks.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/notes/${item.slug}`}
                          className="transition hover:text-foreground"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-muted-foreground/80">
                          最終更新: {formatDate(item.updatedAt)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li>
                      このノートを参照している公開ノートはまだありません。
                    </li>
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </article>
      <Footer />
    </main>
  );
}
