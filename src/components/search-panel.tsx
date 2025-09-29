"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { useStaticSearch } from "@/lib/static-search";

export function SearchPanel() {
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

  const placeholder = useMemo(
    () =>
      initializing ? "検索エンジンを初期化しています..." : "キーワードで検索",
    [initializing],
  );

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
        {!statusMessage && !error ? (
          <p className="text-xs text-muted-foreground">
            {query.trim().length === 0
              ? "公開済みのノート全体を対象に検索できます。キーワードを入力してください。"
              : isSearching
                ? "検索中..."
                : `${results.length}件ヒット`}
          </p>
        ) : null}
      </div>
      <div className="space-y-4">
        {results.length === 0 && query.trim().length > 0 && !isSearching ? (
          <p className="text-sm text-muted-foreground">
            該当するノートは見つかりませんでした。
          </p>
        ) : null}
        <ul className="space-y-4">
          {results.map((result) => (
            <li key={result.id}>
              <Link
                href={`/notes/${result.slug}`}
                className="block rounded-lg border border-border/70 bg-card/30 px-5 py-4 transition hover:border-primary/60 hover:bg-card"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {result.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    SCORE {result.score.toFixed(2)}
                  </span>
                </div>
                {result.summary ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {result.summary}
                  </p>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {result.content.slice(0, 160)}
                    {result.content.length > 160 ? "…" : ""}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
