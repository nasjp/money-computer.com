import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

import { remarkInternalLinks } from "@/lib/remark-internal-links";

export async function renderMarkdownToHtml(
  source: string,
  referenceLookup: Record<string, string>,
) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkInternalLinks, { referenceMap: referenceLookup })
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(source);

  return String(file);
}
