import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  SpinnerGapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";

import { useArticle } from "@/contexts/article/useArticle";
import { generateQuestions } from "@/utils/generateQuestions";
import type { Question } from "@/utils/generateQuestions";

import Button from "@/components/ui/Button";
import NumberPicker from "@/components/ui/NumberPicker";

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
        <Button variant={"secondary"} size={"icon"} onClick={() => navigate("/read")}>
          <ArrowLeftIcon weight="bold" size={14} />
        </Button>
        <div>
          <p className="text-sub" style={{ fontSize: "var(--text-hint)" }}>
            Quiz
          </p>
          <h2 className="text-text leading-tight" style={{ fontSize: "var(--text-body)" }}>
            {title}
          </h2>
        </div>
      </div>

      {(status === "idle" || status === "error") && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sub" style={{ fontSize: "var(--text-label)" }}>
                Number of questions
              </span>
            </div>
            <NumberPicker value={count} min={1} onValueChange={setCount} />
          </div>

          {status === "error" && (
            <p className="text-error" style={{ fontSize: "var(--text-label)" }}>
              {errorMsg}
            </p>
          )}

          <Button onClick={handleGenerate} variant={"primary"}>
            Generate questions
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-3 text-foreground">
          <SpinnerGapIcon size={20} className="animate-spin" />
          <span>thinking...</span>
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
                  <span className="text-foreground tabular-nums">Q{qi + 1}. </span>
                  {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi;
                    const isCorrect = q.answerIndex === oi;
                    return (
                      <Button
                        variant={"secondary"}
                        className={
                          answered && isCorrect
                            ? "bg-success text-success-foreground"
                            : isSelected
                              ? "bg-error text-error-foreground"
                              : ""
                        }
                        key={oi}
                        onClick={() => handleSelect(qi, oi)}
                        disabled={answered}
                      >
                        {opt}
                        {answered && isCorrect ? (
                          <CheckCircleIcon
                            size={16}
                            className="ml-auto shrink-0 text-success-foreground"
                          />
                        ) : isSelected ? (
                          <XCircleIcon
                            size={16}
                            className="ml-auto shrink-0 text-error-foreground"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="ml-auto shrink-0 select-none invisible"
                            size={16}
                          />
                        )}
                      </Button>
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
              <Button
                variant={"primary"}
                onClick={() => {
                  setStatus("idle");
                  setQuestions([]);
                  setSelections([]);
                }}
              >
                <ArrowCounterClockwiseIcon size={16} weight="fill" />
                <p className="pl-1">Try again</p>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
