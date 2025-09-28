import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { remarkInternalLinks } from "@/lib/remark-internal-links";

export async function renderMarkdownToReact(
  source: string,
  referenceLookup: Record<string, string>,
): Promise<ReactNode> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkInternalLinks, { referenceMap: referenceLookup })
    .use(remarkRehype)
    .use(rehypeSlug);

  const tree = await processor.run(processor.parse(source));

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
  });
}
