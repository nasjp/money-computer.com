"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { ContentCard } from "@/components/content-card";
import type { ContentMeta } from "@/lib/content";
import { useStaticSearch } from "@/lib/static-search";

type SearchPanelClientProps = {
  recommended: ContentMeta[];
  allContent: ContentMeta[];
};

export function SearchPanelClient({
  recommended,
  allContent,
}: SearchPanelClientProps) {
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

  const metaBySlug = useMemo(() => {
    const map = new Map<string, ContentMeta>();
    for (const item of allContent) {
      map.set(item.slug, item);
    }
    return map;
  }, [allContent]);

  const displayContent: ContentMeta[] = useMemo(() => {
    if (!hasQuery) {
      return recommended;
    }

    const found: ContentMeta[] = [];
    for (const result of results) {
      const meta = metaBySlug.get(result.slug);
      if (meta && !found.some((item) => item.slug === meta.slug)) {
        found.push(meta);
      }
    }
    return found;
  }, [hasQuery, recommended, results, metaBySlug]);

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
    displayContent.length === 0;

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayContent.map((item) => (
            <ContentCard key={item.slug} content={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
