import { SearchPanelClient } from "@/components/search-panel-client";
import { getPublishedContentMeta } from "@/lib/content";

const RECOMMENDED_RESULT_LIMIT = 8;

export async function SearchPanel() {
  const allContent = await getPublishedContentMeta();
  const recommended = allContent.slice(0, RECOMMENDED_RESULT_LIMIT);

  return (
    <SearchPanelClient recommended={recommended} allContent={allContent} />
  );
}
