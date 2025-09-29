import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

import matter from "gray-matter";

interface GeneratedDocument {
  slug: string;
  title: string;
  summary: string;
  content: string;
}

const SUMMARY_MAX_LENGTH = 160;

const CONTENT_ROOT = path.join(process.cwd(), "content", "notes");
const OUTPUT_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "static-search",
  "docs.generated.json",
);

async function ensureContentDirectory(): Promise<void> {
  await fs.mkdir(CONTENT_ROOT, { recursive: true });
}

async function loadMdxFiles(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name)
    .sort();
}

function normalizeWhitespace(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function toPlainText(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/^[\s>*-]+/gm, " ")
    .replace(/[#*_~=]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createSummary(value: string): string {
  if (value.length === 0) {
    return "";
  }
  const characters = Array.from(value);
  if (characters.length <= SUMMARY_MAX_LENGTH) {
    return value;
  }
  return `${characters.slice(0, SUMMARY_MAX_LENGTH).join("")}…`;
}

async function buildDocument(
  fileName: string,
): Promise<GeneratedDocument | null> {
  const filePath = path.join(CONTENT_ROOT, fileName);
  const file = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(file);

  if (!data || data.status === "draft") {
    return null;
  }

  const slug =
    typeof data.slug === "string" && data.slug.length > 0
      ? data.slug
      : fileName.replace(/\.mdx$/, "");
  const title = typeof data.title === "string" ? data.title : slug;

  const segments = [title, content ?? ""]
    .map((segment) => segment.trim())
    .filter(Boolean);

  const plainText = toPlainText(content ?? "");
  const summary = createSummary(plainText);

  return {
    slug,
    title,
    summary,
    content: normalizeWhitespace(segments.join("\n\n")),
  };
}

async function main(): Promise<void> {
  await ensureContentDirectory();
  const mdxFiles = await loadMdxFiles();

  const docs: GeneratedDocument[] = [];
  for (const fileName of mdxFiles) {
    const doc = await buildDocument(fileName);
    if (doc) {
      docs.push(doc);
    }
  }

  const output = JSON.stringify(docs, null, 2);
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${output}\n`, "utf8");
}

void (async () => {
  try {
    await main();
  } catch (error) {
    console.error("Failed to generate search docs:", error);
    process.exitCode = 1;
  }
})();
