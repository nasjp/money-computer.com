import * as duckdb from "@duckdb/duckdb-wasm";

import { DOCS, MANUAL_BUNDLES } from "./constants";
import { createTokenizer } from "./tokenizer";
import type {
  SearchResult,
  StaticSearchEngine,
  StaticSearchVersions,
} from "./types";

export type CreateStaticSearchEngineOptions = {
  reportStatus?: (message: string | null) => void;
};

type SearchRow = {
  id: number;
  score: number;
  slug: string;
  title: string;
  summary: string;
  note: string;
};

export async function createStaticSearchEngine(
  options: CreateStaticSearchEngineOptions = {},
): Promise<StaticSearchEngine> {
  const { reportStatus } = options;

  reportStatus?.("検索エンジンを起動しています...");

  const { tokenize: tokenizeInput, version: linderaVersion } =
    await createTokenizer();

  reportStatus?.("検索データベースを準備しています...");

  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
  if (!bundle.mainWorker) {
    throw new Error("DuckDBのワーカーファイルを解決できませんでした。");
  }

  const worker = new Worker(bundle.mainWorker);
  const logger = new duckdb.VoidLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  await db.open({});

  const connection = await db.connect();

  await connection.query("LOAD fts;");
  await connection.query("INSTALL fts;");
  await connection.query("CREATE SEQUENCE IF NOT EXISTS id_sequence START 1;");
  await connection.query(
    "CREATE TABLE sora_doc (id INTEGER DEFAULT nextval('id_sequence') PRIMARY KEY, slug VARCHAR, title VARCHAR, summary VARCHAR, note VARCHAR, note_t VARCHAR);",
  );

  for (const doc of DOCS) {
    const tokens = doc.tokens;

    const statement = await connection.prepare(
      "INSERT INTO sora_doc (slug, title, summary, note, note_t) VALUES (?, ?, ?, ?, ?)",
    );

    try {
      await statement.query(
        doc.slug,
        doc.title,
        doc.summary ?? "",
        doc.note,
        tokens,
      );
    } finally {
      await statement.close();
    }
  }

  await connection.query(
    "PRAGMA create_fts_index(sora_doc, id, note_t, stemmer = 'none', stopwords = 'none', ignore = '', lower = false, strip_accents = false);",
  );

  const versions: StaticSearchVersions = {
    duckdb: await db.getVersion(),
    duckdbWasm: duckdb.PACKAGE_VERSION,
    lindera: linderaVersion,
  };

  reportStatus?.(null);

  let terminated = false;

  const search = async (input: string): Promise<SearchResult[]> => {
    if (terminated) {
      throw new Error("検索エンジンは終了済みです。");
    }

    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return [];
    }

    const tokenStrings = tokenizeInput(trimmed);
    if (tokenStrings.length === 0) {
      return [];
    }

    const tokens = tokenStrings.join(" ");

    if (tokens.length === 0) {
      return [];
    }

    const statement = await connection.prepare(
      "SELECT id, fts_main_sora_doc.match_bm25(id, ?) AS score, slug, title, summary, note FROM sora_doc WHERE score IS NOT NULL ORDER BY score DESC",
    );

    try {
      const data = await statement.query(tokens);
      const rows = data.toArray() as SearchRow[];

      return rows.map((row) => ({
        id: Number(row.id),
        score: Number(row.score),
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        note: row.note,
      }));
    } finally {
      await statement.close();
    }
  };

  const terminate = async () => {
    if (terminated) {
      return;
    }

    terminated = true;

    await connection.close();
    await db.terminate();
    worker.terminate();
  };

  return {
    search,
    terminate,
    versions,
  };
}
