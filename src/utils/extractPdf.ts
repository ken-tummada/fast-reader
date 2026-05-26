import { PDFParse } from "pdf-parse";

PDFParse.setWorker(
  "https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.mjs"
);

export interface ExtractionResult {
  title: string;
  paragraphs: string[];
}

export const extractPdfText = async (file: File): Promise<ExtractionResult> => {
  const data = new Uint8Array(await file.arrayBuffer());
  const parser = new PDFParse({ data });

  const textResult = await parser.getText();
  const infoResult = await parser.getInfo().catch(() => null);

  const title =
    (infoResult?.info?.Title as string | undefined)?.trim() || file.name.replace(/\.pdf$/i, "");

  const paragraphs = textResult.text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 20);

  return { title, paragraphs };
};
