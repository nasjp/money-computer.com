import { SearchPanelClient } from "@/components/search-panel-client";
import { getLatestContentMeta } from "@/lib/content";
import { formatDate } from "@/lib/date";

const RECOMMENDED_RESULT_LIMIT = 8;
const DESCRIPTION_MAX_LENGTH = 160;

function buildDescription(summary: string, insight?: string) {
  const base = insight?.trim().length ? insight.trim() : summary.trim();
  if (base.length === 0) {
    return "概要はまだ登録されていません。";
  }
  if (base.length <= DESCRIPTION_MAX_LENGTH) {
    return base;
  }
  return `${base.slice(0, DESCRIPTION_MAX_LENGTH)}…`;
}

export async function SearchPanel() {
  const latest = await getLatestContentMeta(RECOMMENDED_RESULT_LIMIT);

  const recommended = latest.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: buildDescription(item.summary, item.insight),
    updatedAtLabel: formatDate(item.updatedAt),
  }));

  return <SearchPanelClient recommended={recommended} />;
}
