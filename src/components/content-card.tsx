import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { ContentMeta } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  content: ContentMeta;
  className?: string;
  highlightInsight?: boolean;
}

export function ContentCard({
  content,
  className,
  highlightInsight = false,
}: ContentCardProps) {
  const { slug, title, updatedAt, tags, description } = content;

  const descriptionParagraph = description ? (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {description}
    </p>
  ) : null;

  return (
    <Link
      href={`/notes/${slug}`}
      className={cn(
        "group block rounded-lg border border-border/80 bg-card/40 p-6 transition hover:border-foreground/40 hover:bg-card",
        className,
      )}
    >
      <article className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(updatedAt)}</span>
            <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-foreground" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            <span className="transition group-hover:text-primary">{title}</span>
          </h3>
          {highlightInsight ? null : descriptionParagraph}
        </div>
        {highlightInsight && description ? (
          <div className="rounded-md border border-primary/40 bg-primary/5 p-4 text-sm leading-relaxed text-primary">
            {description}
          </div>
        ) : null}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
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
  );
}
