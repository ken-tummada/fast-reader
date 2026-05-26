import { createContext } from "react";

export interface ArticleContextValue {
  paragraphs: string[];
  title: string;
  setParagraphs: (paragraphs: string[], title: string) => void;
  clear: () => void;
}

export const ArticleContext = createContext<ArticleContextValue | null>(null);
