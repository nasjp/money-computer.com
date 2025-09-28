import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDate(date: string | Date, pattern = "yyyy年M月d日") {
  const target = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(target.getTime())) {
    return "日付未設定";
  }
  return format(target, pattern, { locale: ja });
}
