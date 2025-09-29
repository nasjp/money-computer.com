import type * as duckdb from "@duckdb/duckdb-wasm";

import docsData from "./docs.generated.json";
import type { SearchDocument } from "./types";

export const DEFAULT_QUERY = "";

export const DOCS = docsData as ReadonlyArray<SearchDocument>;

export const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm",
      import.meta.url,
    ).toString(),
    mainWorker: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
      import.meta.url,
    ).toString(),
  },
  eh: {
    mainModule: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm",
      import.meta.url,
    ).toString(),
    mainWorker: new URL(
      "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
      import.meta.url,
    ).toString(),
  },
};
