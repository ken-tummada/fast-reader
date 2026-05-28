import { createContext } from "react";

export interface ArticleContextType {
  paragraphs: string[];
  title: string;
  setParagraphs: (paragraphs: string[], title: string) => void;
  clear: () => void;
}

export const ArticleContext = createContext<ArticleContextType | null>(null);
