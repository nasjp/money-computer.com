"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DEFAULT_QUERY } from "./constants";
import { createStaticSearchEngine } from "./engine";
import type { SearchResult, StaticSearchEngine } from "./types";

type UseStaticSearchResult = {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResult[];
  statusMessage: string | null;
  initializing: boolean;
  error: string | null;
  isSearching: boolean;
  duckdbVersion: string | null;
  duckdbWasmVersion: string | null;
  linderaVersion: string | null;
  executeSearch: (input: string) => Promise<void>;
};

export function useStaticSearch(): UseStaticSearchResult {
  const [statusMessage, setStatusMessage] = useState<string | null>(
    "準備中です...",
  );
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [duckdbVersion, setDuckdbVersion] = useState<string | null>(null);
  const [duckdbWasmVersion, setDuckdbWasmVersion] = useState<string | null>(
    null,
  );
  const [linderaVersion, setLinderaVersion] = useState<string | null>(null);

  const engineRef = useRef<StaticSearchEngine | null>(null);
  const searchIdRef = useRef(0);
  const isActiveRef = useRef(true);

  const executeSearch = useCallback(async (input: string) => {
    const engine = engineRef.current;

    if (!engine) {
      return;
    }

    const trimmed = input.trim();
    const currentSearchId = ++searchIdRef.current;

    if (trimmed.length === 0) {
      if (currentSearchId === searchIdRef.current && isActiveRef.current) {
        setResults([]);
        setError(null);
        setIsSearching(false);
      }
      return;
    }

    if (isActiveRef.current) {
      setIsSearching(true);
    }

    try {
      const searchResults = await engine.search(trimmed);

      if (currentSearchId !== searchIdRef.current || !isActiveRef.current) {
        return;
      }

      setResults(searchResults);
      setError(null);
    } catch (cause) {
      if (currentSearchId !== searchIdRef.current || !isActiveRef.current) {
        return;
      }

      console.error(cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "検索中にエラーが発生しました。",
      );
    } finally {
      if (currentSearchId === searchIdRef.current && isActiveRef.current) {
        setIsSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    isActiveRef.current = true;
    setError(null);

    const setup = async () => {
      try {
        const engine = await createStaticSearchEngine({
          reportStatus: (message) => {
            if (cancelled || !isActiveRef.current) {
              return;
            }
            setStatusMessage(message);
          },
        });

        if (cancelled || !isActiveRef.current) {
          await engine.terminate();
          return;
        }

        engineRef.current = engine;
        setDuckdbVersion(engine.versions.duckdb);
        setDuckdbWasmVersion(engine.versions.duckdbWasm);
        setLinderaVersion(engine.versions.lindera);
        setStatusMessage(null);
        setInitializing(false);

        await executeSearch(DEFAULT_QUERY);
      } catch (cause) {
        if (cancelled || !isActiveRef.current) {
          return;
        }

        console.error(cause);
        setStatusMessage(null);
        setInitializing(false);
        setError(
          cause instanceof Error ? cause.message : "初期化に失敗しました。",
        );
      }
    };

    void setup();

    return () => {
      cancelled = true;
      isActiveRef.current = false;
      const engine = engineRef.current;
      if (engine) {
        void engine.terminate();
        engineRef.current = null;
      }
    };
  }, [executeSearch]);

  return {
    query,
    setQuery,
    results,
    statusMessage,
    initializing,
    error,
    isSearching,
    duckdbVersion,
    duckdbWasmVersion,
    linderaVersion,
    executeSearch,
  };
}
