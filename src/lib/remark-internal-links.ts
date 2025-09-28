import type { Link, Root, Text } from "mdast";
import type { Plugin } from "unified";
import type { Parent } from "unist";
import { visit } from "unist-util-visit";

const INTERNAL_LINK_PATTERN = /\[\[([^\]]+)\]\]/g;

type Options = {
  referenceMap?: Record<string, string>;
  basePath?: string;
};

function resolveLabel(label: string, map: Record<string, string> | undefined) {
  if (!map) {
    return undefined;
  }

  const direct = map[label];
  if (direct) {
    return direct;
  }

  const normalized = label.trim().toLowerCase();
  const matchedEntry = Object.entries(map).find(
    ([candidate]) => candidate.trim().toLowerCase() === normalized,
  );

  return matchedEntry?.[1];
}

export const remarkInternalLinks: Plugin<[Options?], Root> = (options = {}) => {
  const { referenceMap, basePath = "/contents" } = options;

  return (tree) => {
    visit(tree, "text", (node: Text, index, parent: Parent | null) => {
      if (!parent || typeof index !== "number") {
        return;
      }

      const originalValue = node.value;
      if (!INTERNAL_LINK_PATTERN.test(originalValue)) {
        return;
      }

      INTERNAL_LINK_PATTERN.lastIndex = 0;

      const segments: Array<Text | Link> = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null =
        INTERNAL_LINK_PATTERN.exec(originalValue);

      while (match) {
        const [fullMatch, label] = match;
        const preceding = originalValue.slice(lastIndex, match.index);

        if (preceding) {
          segments.push({ type: "text", value: preceding });
        }

        const targetSlug = resolveLabel(label, referenceMap);
        if (!targetSlug) {
          segments.push({ type: "text", value: label });
        } else {
          segments.push({
            type: "link",
            url: `${basePath}/${targetSlug}`,
            data: {
              hProperties: {
                "data-internal-link": "true",
              },
            },
            children: [
              {
                type: "text",
                value: label,
              },
            ],
          });
        }

        lastIndex = match.index + fullMatch.length;

        match = INTERNAL_LINK_PATTERN.exec(originalValue);
      }

      const trailing = originalValue.slice(lastIndex);
      if (trailing) {
        segments.push({ type: "text", value: trailing });
      }

      parent.children.splice(index, 1, ...segments);
    });
  };
};
