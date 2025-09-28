import * as duckdb from '@duckdb/duckdb-wasm'

import { DOCS, MANUAL_BUNDLES } from './constants'
import type {
  LinderaTokenizer,
  SearchResult,
  StaticSearchEngine,
  StaticSearchVersions,
  TokenMap,
} from './types'

export type CreateStaticSearchEngineOptions = {
  reportStatus?: (message: string | null) => void
}

type SearchRow = {
  id: number
  score: number
  content: string
}

export async function createStaticSearchEngine(
  options: CreateStaticSearchEngineOptions = {},
): Promise<StaticSearchEngine> {
  const { reportStatus } = options

  reportStatus?.('Linderaを初期化しています...')

  const linderaModule = await import('lindera-wasm-ipadic')
  await linderaModule.default()

  const builder = new linderaModule.TokenizerBuilder()
  builder.setDictionary('embedded://ipadic')
  builder.setMode('normal')
  builder.appendCharacterFilter('unicode_normalize', { kind: 'nfkc' })
  builder.appendTokenFilter('lowercase', {})
  builder.appendTokenFilter('japanese_compound_word', {
    kind: 'ipadic',
    tags: ['名詞,数'],
    new_tag: '名詞,数',
  })
  builder.appendTokenFilter('japanese_number', { tags: ['名詞,数'] })

  const tokenizer = builder.build() as unknown as LinderaTokenizer

  reportStatus?.('DuckDBを初期化しています...')

  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)
  if (!bundle.mainWorker) {
    throw new Error('DuckDBのワーカーファイルを解決できませんでした。')
  }

  const worker = new Worker(bundle.mainWorker)
  const logger = new duckdb.VoidLogger()
  const db = new duckdb.AsyncDuckDB(logger, worker)

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  await db.open({})

  const connection = await db.connect()

  await connection.query('LOAD fts;')
  await connection.query('INSTALL fts;')
  await connection.query('CREATE SEQUENCE IF NOT EXISTS id_sequence START 1;')
  await connection.query(
    "CREATE TABLE sora_doc (id INTEGER DEFAULT nextval('id_sequence') PRIMARY KEY, content VARCHAR, content_t VARCHAR);",
  )

  for (const doc of DOCS) {
    const tokens = tokenizer
      .tokenize(doc)
      .map((token: TokenMap) => token.get('text'))
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(' ')

    const statement = await connection.prepare('INSERT INTO sora_doc (content, content_t) VALUES (?, ?)')

    try {
      await statement.query(doc, tokens)
    } finally {
      await statement.close()
    }
  }

  await connection.query(
    "PRAGMA create_fts_index(sora_doc, id, content_t, stemmer = 'none', stopwords = 'none', ignore = '', lower = false, strip_accents = false);",
  )

  const versions: StaticSearchVersions = {
    duckdb: await db.getVersion(),
    duckdbWasm: duckdb.PACKAGE_VERSION,
    lindera: linderaModule.getVersion(),
  }

  reportStatus?.(null)

  let terminated = false

  const search = async (input: string): Promise<SearchResult[]> => {
    if (terminated) {
      throw new Error('検索エンジンは終了済みです。')
    }

    const trimmed = input.trim()
    if (trimmed.length === 0) {
      return []
    }

    const tokens = tokenizer
      .tokenize(trimmed)
      .map((token: TokenMap) => token.get('text'))
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(' ')

    if (tokens.length === 0) {
      return []
    }

    const statement = await connection.prepare(
      'SELECT id, fts_main_sora_doc.match_bm25(id, ?) AS score, content FROM sora_doc WHERE score IS NOT NULL ORDER BY score DESC',
    )

    try {
      const data = await statement.query(tokens)
      const rows = data.toArray() as SearchRow[]

      return rows.map((row) => ({
        id: Number(row.id),
        score: Number(row.score),
        content: row.content,
      }))
    } finally {
      await statement.close()
    }
  }

  const terminate = async () => {
    if (terminated) {
      return
    }

    terminated = true

    await connection.close()
    await db.terminate()
    worker.terminate()
  }

  return {
    search,
    terminate,
    versions,
  }
}
