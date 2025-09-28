export type SearchResult = {
  id: number
  score: number
  content: string
}

export type TokenMap = Map<string, string>

export type LinderaTokenizer = {
  tokenize: (value: string) => TokenMap[]
}

export type StaticSearchVersions = {
  duckdb: string
  duckdbWasm: string
  lindera: string
}

export type StaticSearchEngine = {
  search: (input: string) => Promise<SearchResult[]>
  terminate: () => Promise<void>
  versions: StaticSearchVersions
}
