"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { useStaticSearch } from "@/lib/static-search";

type RecommendedResult = {
  slug: string;
  title: string;
  description: string;
  updatedAtLabel: string;
};

type SearchPanelClientProps = {
  recommended: RecommendedResult[];
};

type DisplayItem = {
  key: string;
  slug: string;
  title: string;
  description: string;
  badgeVariant: "score" | "meta";
  badgeLabel: string;
};

const DESCRIPTION_MAX_LENGTH = 160;

function truncate(value: string) {
  const characters = Array.from(value);
  if (characters.length <= DESCRIPTION_MAX_LENGTH) {
    return value;
  }
  return `${characters.slice(0, DESCRIPTION_MAX_LENGTH).join("")}…`;
}

export function SearchPanelClient({ recommended }: SearchPanelClientProps) {
  const {
    query,
    setQuery,
    results,
    statusMessage,
    initializing,
    error,
    isSearching,
    executeSearch,
  } = useStaticSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      void executeSearch(query);
    }, 200);

    return () => clearTimeout(handle);
  }, [query, executeSearch]);

  const hasQuery = query.trim().length > 0;

  const displayItems: DisplayItem[] = useMemo(() => {
    if (!hasQuery) {
      return recommended.map((item) => ({
        key: `recommended-${item.slug}`,
        slug: item.slug,
        title: item.title,
        description: item.description,
        badgeVariant: "meta" as const,
        badgeLabel: `最終更新: ${item.updatedAtLabel}`,
      }));
    }

    return results.map((result) => {
      const baseText = result.summary?.trim().length
        ? result.summary.trim()
        : result.content;

      return {
        key: `search-${result.id}`,
        slug: result.slug,
        title: result.title,
        description: truncate(baseText.trim()),
        badgeVariant: "score" as const,
        badgeLabel: `SCORE ${result.score.toFixed(2)}`,
      };
    });
  }, [hasQuery, recommended, results]);

  const placeholder = useMemo(
    () =>
      initializing ? "検索エンジンを初期化しています..." : "キーワードで検索",
    [initializing],
  );

  const helperText = useMemo(() => {
    if (error) {
      return null;
    }
    if (!hasQuery) {
      return `最近更新されたノートを ${recommended.length} 件表示しています。`;
    }
    if (isSearching) {
      return "検索中...";
    }
    if (statusMessage) {
      return null;
    }
    return `${results.length}件ヒット`;
  }, [
    error,
    hasQuery,
    isSearching,
    recommended.length,
    results.length,
    statusMessage,
  ]);

  const showEmptyState =
    hasQuery &&
    !isSearching &&
    !statusMessage &&
    !error &&
    displayItems.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card/40 px-6 py-8 shadow-sm">
        <label
          htmlFor="search-query"
          className="flex items-center gap-3 text-sm font-medium text-muted-foreground"
        >
          <Search className="size-4" />
          ノート検索
        </label>
        <input
          ref={inputRef}
          id="search-query"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-border/70 bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary"
          aria-label="ノート検索"
        />
        {statusMessage ? (
          <p className="text-xs text-muted-foreground">{statusMessage}</p>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
      <div className="space-y-4">
        {showEmptyState ? (
          <p className="text-sm text-muted-foreground">
            該当するノートは見つかりませんでした。
          </p>
        ) : null}
        <ul className="space-y-4">
          {displayItems.map((item) => (
            <li key={item.key}>
              <Link
                href={`/notes/${item.slug}`}
                className="block rounded-lg border border-border/70 bg-card/30 px-5 py-4 transition hover:border-primary/60 hover:bg-card"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.badgeVariant === "score" ? (
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {item.badgeLabel}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/80">
                      {item.badgeLabel}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
