import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useNavigate } from "react-router";
import { FilePdfIcon, SpinnerGapIcon } from "@phosphor-icons/react";

import { useArticle } from "@/hooks/useArticle";
import { extractPdfText } from "@/utils/extractPdf";

type Status = "idle" | "loading" | "error";

export default function PdfImport() {
  const { setParagraphs } = useArticle();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setStatus("error");
        setErrorMsg("Please select a PDF file.");
        return;
      }

      setStatus("loading");
      setErrorMsg("");

      try {
        const { title: detectedTitle, paragraphs } = await extractPdfText(file);
        if (paragraphs.length === 0) {
          setStatus("error");
          setErrorMsg("No text could be extracted from this PDF.");
          return;
        }
        const title = detectedTitle || file.name.replace(/\.pdf$/i, "");
        setParagraphs(paragraphs, title);
        navigate("/read");
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Failed to process PDF.");
      }
    },
    [setParagraphs, navigate]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex w-full max-w-md cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed px-8 py-12 transition-colors ${
        dragOver
          ? "border-primary-foreground bg-primary-foreground/5"
          : "border-foreground hover:border-primary-foreground hover:bg-primary-foreground/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />

      {status === "loading" ? (
        <>
          <SpinnerGapIcon size={48} className="animate-spin text-sub" />
          <p className="text-sub">Extracting text…</p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sub">
            <FilePdfIcon size={48} />
          </div>
          <p className="text-sub text-center">Drop a PDF here or click to select</p>
          {status === "error" && <p className="text-center text-sm text-red-400">{errorMsg}</p>}
        </>
      )}
    </label>
  );
}
