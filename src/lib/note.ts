import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";

const NOTE_ROOT = path.join(process.cwd(), "notes");
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

export type NoteStatus = "published" | "draft";

export type NoteMeta = {
  slug: string;
  title: string;
  bookTitle: string;
  author: string;
  publisher: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  status: NoteStatus;
  outboundReferences: string[];
  unresolvedReferences: string[];
  filePath: string;
  description: string;
};

export type NoteDetail = NoteMeta & {
  body: string;
};

type RawNote = {
  meta: NoteMeta;
  body: string;
  plainText: string;
  referenceLabels: string[];
};

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

async function ensureNoteDirectory() {
  await fs.mkdir(NOTE_ROOT, { recursive: true });
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

async function readRawNote(fileName: string): Promise<RawNote> {
  const filePath = path.join(NOTE_ROOT, fileName);
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

  const meta: NoteMeta = {
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

const loadRawNotes = cache(async () => {
  await ensureNoteDirectory();
  const entries = await fs.readdir(NOTE_ROOT);
  const mdxFiles = entries.filter((entry) => entry.endsWith(".mdx"));
  const notes = await Promise.all(mdxFiles.map(readRawNote));
  return notes;
});

function buildReferenceMap(rawNotes: RawNote[]) {
  const map = new Map<string, string>();
  for (const raw of rawNotes) {
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
  rawNotes: RawNote[],
  referenceMap: Map<string, string>,
) {
  for (const raw of rawNotes) {
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

function sortByUpdatedAt(meta: NoteMeta[]) {
  return [...meta].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

const loadMeta = cache(async () => {
  const rawNotes = await loadRawNotes();
  const referenceMap = buildReferenceMap(rawNotes);
  resolveReferences(rawNotes, referenceMap);
  return rawNotes.map((raw) => raw.meta);
});

export const getPublishedNoteMeta = cache(async () => {
  const meta = await loadMeta();
  return sortByUpdatedAt(meta.filter((item) => item.status === "published"));
});
function buildBacklinks(meta: NoteMeta[], slug: string) {
  return meta.filter((item) => item.outboundReferences.includes(slug));
}

export const getNoteBySlug = cache(
  async (slug: string): Promise<NoteDetail> => {
    const rawNotes = await loadRawNotes();
    const target = rawNotes.find((raw) => raw.meta.slug === slug);

    if (!target) {
      throw new Error(`Note not found for slug: ${slug}`);
    }

    return {
      ...target.meta,
      body: target.body,
    };
  },
);

export const getBacklinksForSlug = cache(async (slug: string) => {
  const meta = await getPublishedNoteMeta();
  return buildBacklinks(meta, slug);
});
