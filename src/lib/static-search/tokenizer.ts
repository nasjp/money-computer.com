import type { LinderaTokenizer, TokenMap } from "./types";

export type Tokenize = (value: string) => string[];

type TokenizerOptions = {
  onFallback?: (error: unknown) => void;
  moduleOrPath?:
    | string
    | URL
    | ArrayBuffer
    | ArrayBufferView
    | WebAssembly.Module;
};

type Tokenizer = {
  tokenize: Tokenize;
  version: string;
};

const toTokenStrings = (tokenMaps: TokenMap[]): string[] => {
  const tokens: string[] = [];
  for (const token of tokenMaps) {
    const value = token.get("text");
    if (typeof value !== "string") {
      continue;
    }
    const sanitized = value.trim();
    if (sanitized.length === 0) {
      continue;
    }
    tokens.push(sanitized);
  }
  return tokens;
};

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("ja", { granularity: "word" })
    : null;

const fallbackTokenize = (value: string): string[] => {
  if (segmenter) {
    const segments: string[] = [];
    for (const item of segmenter.segment(value)) {
      const text = item.segment.trim();
      if (text.length === 0) {
        continue;
      }
      if ("isWordLike" in item && item.isWordLike === false) {
        continue;
      }
      segments.push(text);
    }
    if (segments.length > 0) {
      return segments;
    }
  }

  return value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
};

export async function createTokenizer(
  options: TokenizerOptions = {},
): Promise<Tokenizer> {
  const { moduleOrPath, onFallback } = options;

  const linderaModule = await import("lindera-wasm-ipadic");
  if (moduleOrPath) {
    await linderaModule.default({ module_or_path: moduleOrPath });
  } else {
    await linderaModule.default();
  }

  const builder = new linderaModule.TokenizerBuilder();
  builder.setDictionary("embedded://ipadic");
  builder.setMode("normal");
  builder.appendCharacterFilter("unicode_normalize", { kind: "nfkc" });
  builder.appendTokenFilter("lowercase", {});
  builder.appendTokenFilter("japanese_compound_word", {
    kind: "ipadic",
    tags: ["名詞,数"],
    new_tag: "名詞,数",
  });
  builder.appendTokenFilter("japanese_number", { tags: ["名詞,数"] });

  const tokenizer = builder.build() as unknown as LinderaTokenizer;

  let fallbackNotified = false;

  const tokenize: Tokenize = (value: string): string[] => {
    try {
      return toTokenStrings(tokenizer.tokenize(value) as unknown as TokenMap[]);
    } catch (error) {
      if (!fallbackNotified) {
        const message =
          "静的検索: テキスト解析の初期処理で問題が発生したためフォールバック処理を利用します。";
        if (
          typeof console !== "undefined" &&
          typeof console.warn === "function"
        ) {
          console.warn(message);
        }
        fallbackNotified = true;
      }
      onFallback?.(error);
      return fallbackTokenize(value);
    }
  };

  return {
    tokenize,
    version: linderaModule.getVersion(),
  };
}
