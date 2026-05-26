import { useContext } from "react";

import { ArticleContext } from "@/contexts/articleContextValue";
import type { ArticleContextValue } from "@/contexts/articleContextValue";

export function useArticle(): ArticleContextValue {
  const ctx = useContext(ArticleContext);
  if (!ctx) throw new Error("useArticle must be used within ArticleProvider");
  return ctx;
}
