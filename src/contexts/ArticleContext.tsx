import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import { ArticleContext } from "@/contexts/articleContextValue";
import { sampleText } from "@/utils/sampleText";

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [paragraphs, setParagraphsState] = useState<string[]>(sampleText);
  const [title, setTitle] = useState("Sample Text");

  const setParagraphs = useCallback((p: string[], t: string) => {
    setParagraphsState(p);
    setTitle(t);
  }, []);

  const clear = useCallback(() => {
    setParagraphsState(sampleText);
    setTitle("Sample Text");
  }, []);

  return (
    <ArticleContext value={{ paragraphs, title, setParagraphs, clear }}>{children}</ArticleContext>
  );
}
