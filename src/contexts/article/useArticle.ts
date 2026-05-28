import { useContext } from "react";

import { ArticleContext, type ArticleContextType } from "@/contexts/article/ArticleContext";

export function useArticle(): ArticleContextType {
  const ctx = useContext(ArticleContext);
  if (!ctx) throw new Error("useArticle must be used within ArticleProvider");
  return ctx;
}
