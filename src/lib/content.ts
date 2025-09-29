import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "content", "notes");
const DESCRIPTION_MAX_LENGTH = 160;

const FrontMatterSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    bookTitle: z.string(),
    author: z.string().optional().default(""),
    publisher: z.string().optional().default(""),
    publishedAt: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["published", "draft"]).default("draft"),
  })
  .loose();

const INTERNAL_LINK_PATTERN = /\[\[([^\]]+)\]\]/g;

export type ContentStatus = "published" | "draft";

export type ContentMeta = {
  slug: string;
  title: string;
  bookTitle: string;
  author: string;
  publisher: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  status: ContentStatus;
  outboundReferences: string[];
  unresolvedReferences: string[];
  filePath: string;
  description: string;
};

export interface ContentDetail extends ContentMeta {
  body: string;
}

interface RawContent {
  meta: ContentMeta;
  body: string;
  plainText: string;
  referenceLabels: string[];
}

function toPlainText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(INTERNAL_LINK_PATTERN, "$1")
    .replace(/^[\s>*-]+/gm, " ")
    .replace(/[#*_~=]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createDescriptionFromPlainText(plainText: string) {
  if (plainText.length === 0) {
    return "";
  }
  const characters = Array.from(plainText);
  if (characters.length <= DESCRIPTION_MAX_LENGTH) {
    return plainText;
  }
  return `${characters.slice(0, DESCRIPTION_MAX_LENGTH).join("")}…`;
}

async function ensureContentDirectory() {
  await fs.mkdir(CONTENT_ROOT, { recursive: true });
}

function parseDateString(value: string, filePath: string, field: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `Invalid date value for "${field}" in ${filePath}. Expected ISO-8601 string.`,
    );
  }
  return value;
}

async function readRawContent(fileName: string): Promise<RawContent> {
  const filePath = path.join(CONTENT_ROOT, fileName);
  const file = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(file);
  const parsed = FrontMatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Front matter validation failed for ${filePath}: ${parsed.error.message}`,
    );
  }

  const frontMatter = parsed.data;

  const publishedAt = parseDateString(
    frontMatter.publishedAt,
    filePath,
    "publishedAt",
  );
  const updatedAt = parseDateString(
    frontMatter.updatedAt,
    filePath,
    "updatedAt",
  );

  const referenceLabels = Array.from(
    new Set(
      [...content.matchAll(INTERNAL_LINK_PATTERN)].map((match) =>
        match[1].trim(),
      ),
    ),
  );
  const plainText = toPlainText(content);
  const description = createDescriptionFromPlainText(plainText);

  const meta: ContentMeta = {
    slug: frontMatter.slug,
    title: frontMatter.title,
    bookTitle: frontMatter.bookTitle,
    author: frontMatter.author,
    publisher: frontMatter.publisher,
    publishedAt,
    updatedAt,
    tags: frontMatter.tags,
    status: frontMatter.status,
    outboundReferences: [],
    unresolvedReferences: referenceLabels,
    filePath,
    description,
  };

  return {
    meta,
    body: content,
    plainText,
    referenceLabels,
  };
}

const loadRawContents = cache(async () => {
  await ensureContentDirectory();
  const entries = await fs.readdir(CONTENT_ROOT);
  const mdxFiles = entries.filter((entry) => entry.endsWith(".mdx"));
  const contents = await Promise.all(mdxFiles.map(readRawContent));
  return contents;
});

function buildReferenceMap(rawContents: RawContent[]) {
  const map = new Map<string, string>();
  for (const raw of rawContents) {
    const { meta } = raw;
    map.set(meta.slug, meta.slug);
    map.set(meta.title, meta.slug);
    map.set(meta.title.toLowerCase(), meta.slug);
    map.set(meta.bookTitle, meta.slug);
    map.set(meta.bookTitle.toLowerCase(), meta.slug);
  }
  return map;
}

function resolveReferences(
  rawContents: RawContent[],
  referenceMap: Map<string, string>,
) {
  for (const raw of rawContents) {
    const resolved: string[] = [];
    const unresolved: string[] = [];

    for (const label of raw.referenceLabels) {
      const slug =
        referenceMap.get(label) ?? referenceMap.get(label.toLowerCase());
      if (slug) {
        resolved.push(slug);
      } else {
        unresolved.push(label);
      }
    }

    raw.meta.outboundReferences = Array.from(new Set(resolved));
    raw.meta.unresolvedReferences = Array.from(new Set(unresolved));
  }
}

function sortByUpdatedAt(meta: ContentMeta[]) {
  return [...meta].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

const loadMeta = cache(async () => {
  const rawContents = await loadRawContents();
  const referenceMap = buildReferenceMap(rawContents);
  resolveReferences(rawContents, referenceMap);
  return rawContents.map((raw) => raw.meta);
});

export const getAllContentMeta = cache(async () => {
  const meta = await loadMeta();
  return sortByUpdatedAt(meta);
});

export const getPublishedContentMeta = cache(async () => {
  const meta = await loadMeta();
  return sortByUpdatedAt(meta.filter((item) => item.status === "published"));
});

export const getLatestContentMeta = cache(async (limit = 12) => {
  const meta = await getPublishedContentMeta();
  return meta.slice(0, limit);
});

export function buildBacklinks(meta: ContentMeta[], slug: string) {
  return meta.filter((item) => item.outboundReferences.includes(slug));
}

export const getContentBySlug = cache(
  async (slug: string): Promise<ContentDetail> => {
    const rawContents = await loadRawContents();
    const target = rawContents.find((raw) => raw.meta.slug === slug);

    if (!target) {
      throw new Error(`Content not found for slug: ${slug}`);
    }

    return {
      ...target.meta,
      body: target.body,
    };
  },
);

export const getBacklinksForSlug = cache(async (slug: string) => {
  const meta = await getPublishedContentMeta();
  return buildBacklinks(meta, slug);
});

export const getSearchIndex = cache(async () => {
  const rawContents = await loadRawContents();
  const index = rawContents
    .filter((raw) => raw.meta.status === "published")
    .map((raw) => {
      const plainText = raw.plainText;

      return {
        slug: raw.meta.slug,
        title: raw.meta.title,
        tags: raw.meta.tags,
        publishedAt: raw.meta.publishedAt,
        updatedAt: raw.meta.updatedAt,
        text: plainText,
      };
    });

  return index;
});
