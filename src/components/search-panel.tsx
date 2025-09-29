import { SearchPanelClient } from "@/components/search-panel-client";
import { getLatestContentMeta } from "@/lib/content";
import { formatDate } from "@/lib/date";

const RECOMMENDED_RESULT_LIMIT = 8;
const DESCRIPTION_MAX_LENGTH = 160;

function buildDescription(description: string) {
  const trimmed = description.trim();
  if (trimmed.length === 0) {
    return "本文のプレビューを準備しています。";
  }
  const characters = Array.from(trimmed);
  if (characters.length <= DESCRIPTION_MAX_LENGTH) {
    return trimmed;
  }
  return `${characters.slice(0, DESCRIPTION_MAX_LENGTH).join("")}…`;
}

export async function SearchPanel() {
  const latest = await getLatestContentMeta(RECOMMENDED_RESULT_LIMIT);

  const recommended = latest.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: buildDescription(item.description),
    updatedAtLabel: formatDate(item.updatedAt),
  }));

  return <SearchPanelClient recommended={recommended} />;
}
