import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "content", "notes");

const FrontMatterSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    bookTitle: z.string(),
    author: z.string().optional().default(""),
    publisher: z.string().optional().default(""),
    publishedAt: z.string(),
    updatedAt: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["published", "draft"]).default("draft"),
    pinned: z.boolean().default(false),
    pinOrder: z.number().default(0),
    insight: z.string().optional(),
    playbook: z.array(z.string()).default([]),
  })
  .passthrough();

const INTERNAL_LINK_PATTERN = /\[\[([^\]]+)\]\]/g;

export type ContentStatus = "published" | "draft";

export interface ContentMeta {
  slug: string;
  title: string;
  bookTitle: string;
  author: string;
  publisher: string;
  publishedAt: string;
  updatedAt: string;
  summary: string;
  tags: string[];
  status: ContentStatus;
  pinned: boolean;
  pinOrder: number;
  insight?: string;
  playbook: string[];
  outboundReferences: string[];
  unresolvedReferences: string[];
  filePath: string;
}

export interface ContentDetail extends ContentMeta {
  body: string;
}

interface RawContent {
  meta: ContentMeta;
  body: string;
  referenceLabels: string[];
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

  const meta: ContentMeta = {
    slug: frontMatter.slug,
    title: frontMatter.title,
    bookTitle: frontMatter.bookTitle,
    author: frontMatter.author,
    publisher: frontMatter.publisher,
    publishedAt,
    updatedAt,
    summary: frontMatter.summary,
    tags: frontMatter.tags,
    status: frontMatter.status,
    pinned: frontMatter.pinned,
    pinOrder: frontMatter.pinOrder,
    insight: frontMatter.insight,
    playbook: frontMatter.playbook,
    outboundReferences: [],
    unresolvedReferences: referenceLabels,
    filePath,
  };

  return { meta, body: content, referenceLabels };
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
    if (a.pinned !== b.pinned) {
      return Number(b.pinned) - Number(a.pinned);
    }

    if (a.pinned && b.pinned && a.pinOrder !== b.pinOrder) {
      return a.pinOrder - b.pinOrder;
    }

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

export const getPinnedContentMeta = cache(async () => {
  const meta = await getPublishedContentMeta();
  return meta
    .filter((item) => item.pinned)
    .sort((a, b) => a.pinOrder - b.pinOrder);
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
      const plainText = raw.body
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]+`/g, " ")
        .replace(/\[\[(.*?)\]\]/g, "$1")
        .replace(/[#*_>-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        slug: raw.meta.slug,
        title: raw.meta.title,
        summary: raw.meta.summary,
        insight: raw.meta.insight ?? "",
        tags: raw.meta.tags,
        publishedAt: raw.meta.publishedAt,
        updatedAt: raw.meta.updatedAt,
        text: plainText,
      };
    });

  return index;
});
