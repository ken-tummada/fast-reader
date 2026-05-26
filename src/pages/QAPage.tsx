import { useState } from "react";
import { useNavigate } from "react-router";
import { Slider } from "radix-ui";
import { ArrowLeftIcon, SpinnerGapIcon, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

import { useArticle } from "@/hooks/useArticle";
import { generateQuestions } from "@/utils/generateQuestions";
import type { Question } from "@/utils/generateQuestions";

type Status = "idle" | "loading" | "ready" | "error";

export default function QAPage() {
  const navigate = useNavigate();
  const { paragraphs, title } = useArticle();

  const [count, setCount] = useState(5);
  const [status, setStatus] = useState<Status>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selections, setSelections] = useState<(number | null)[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const text = paragraphs.join("\n\n");
      const qs = await generateQuestions(text, count);
      setQuestions(qs);
      setSelections(new Array(qs.length).fill(null));
      setStatus("ready");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to generate questions.");
      setStatus("error");
    }
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (selections[qIdx] !== null) return;
    setSelections((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const answeredCount = selections.filter((s) => s !== null).length;
  const correctCount = questions.reduce((acc, q, i) => {
    return selections[i] === q.answerIndex ? acc + 1 : acc;
  }, 0);
  const allAnswered = status === "ready" && answeredCount === questions.length;

  return (
    <div className="flex w-full flex-col gap-8 pb-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/read")}
          className="flex size-9 items-center justify-center rounded-lg bg-bg-surface text-sub transition-colors hover:bg-accent hover:text-bg"
        >
          <ArrowLeftIcon weight="bold" size={18} />
        </button>
        <div>
          <p className="text-sub" style={{ fontSize: "var(--text-hint)" }}>
            quiz
          </p>
          <h2 className="text-text leading-tight" style={{ fontSize: "var(--text-body)" }}>
            {title}
          </h2>
        </div>
      </div>

      {(status === "idle" || status === "error") && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sub" style={{ fontSize: "var(--text-label)" }}>
                number of questions
              </span>
              <span className="text-text tabular-nums" style={{ fontSize: "var(--text-label)" }}>
                {count}
              </span>
            </div>
            <Slider.Root
              className="relative flex h-5 w-full touch-none items-center select-none"
              value={[count]}
              onValueChange={([v]) => setCount(v)}
              min={1}
              max={20}
              step={1}
            >
              <Slider.Track className="relative h-1 grow rounded-full bg-bg-surface">
                <Slider.Range className="absolute h-full rounded-full bg-sub" />
              </Slider.Track>
              <Slider.Thumb className="block size-4 cursor-pointer rounded-full bg-text transition-colors hover:bg-accent focus:outline-none" />
            </Slider.Root>
          </div>

          {status === "error" && (
            <p className="text-error" style={{ fontSize: "var(--text-label)" }}>
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleGenerate}
            className="self-start rounded-lg bg-accent px-5 py-2.5 font-mono text-bg transition-colors hover:bg-accent/80"
            style={{ fontSize: "var(--text-label)" }}
          >
            generate questions
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-3 text-sub">
          <SpinnerGapIcon size={20} className="animate-spin" />
          <span style={{ fontSize: "var(--text-label)" }}>generating questions…</span>
        </div>
      )}

      {status === "ready" && (
        <div className="flex flex-col gap-10">
          {questions.map((q, qi) => {
            const selected = selections[qi];
            const answered = selected !== null;
            return (
              <div key={qi} className="flex flex-col gap-3">
                <p className="text-text" style={{ fontSize: "var(--text-body)" }}>
                  <span className="text-sub tabular-nums">Q{qi + 1}. </span>
                  {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi;
                    const isCorrect = q.answerIndex === oi;
                    let optClass =
                      "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors";
                    if (!answered) {
                      optClass +=
                        " border-bg-surface text-sub hover:border-sub hover:text-text cursor-pointer";
                    } else if (isCorrect) {
                      optClass += " border-accent text-accent cursor-default";
                    } else if (isSelected) {
                      optClass += " border-error text-error cursor-default";
                    } else {
                      optClass += " border-bg-surface text-sub/40 cursor-default";
                    }
                    return (
                      <button
                        key={oi}
                        className={optClass}
                        onClick={() => handleSelect(qi, oi)}
                        disabled={answered}
                        style={{ fontSize: "var(--text-label)" }}
                      >
                        <span className="tabular-nums text-sub/60">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {opt}
                        {answered && isCorrect && (
                          <CheckCircleIcon size={16} className="ml-auto shrink-0 text-accent" />
                        )}
                        {answered && isSelected && !isCorrect && (
                          <XCircleIcon size={16} className="ml-auto shrink-0 text-error" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <p className="text-sub italic" style={{ fontSize: "var(--text-hint)" }}>
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          {allAnswered && (
            <div className="flex flex-col gap-4 border-t border-bg-surface pt-6">
              <p className="text-text" style={{ fontSize: "var(--text-body)" }}>
                score:{" "}
                <span className="text-accent tabular-nums">
                  {correctCount}/{questions.length}
                </span>
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setQuestions([]);
                  setSelections([]);
                }}
                className="self-start rounded-lg bg-bg-surface px-5 py-2.5 font-mono text-sub transition-colors hover:bg-accent hover:text-bg"
                style={{ fontSize: "var(--text-label)" }}
              >
                try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
