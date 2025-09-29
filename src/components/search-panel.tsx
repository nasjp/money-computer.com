import { SearchPanelClient } from "@/components/search-panel-client";
import { getPublishedNoteMeta } from "@/lib/note";

const RECOMMENDED_RESULT_LIMIT = 6;

export async function SearchPanel() {
  const allNotes = await getPublishedNoteMeta();
  const recommended = allNotes.slice(0, RECOMMENDED_RESULT_LIMIT);

  return <SearchPanelClient recommended={recommended} allNotes={allNotes} />;
}
