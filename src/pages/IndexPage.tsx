import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { Slider } from "radix-ui";

import { sampleText } from "@/utils/sampleText";

const DEFAULT_WPM = 300;
const MIN_WPM = 150;
const MAX_WPM = 1000;

function wpmToMs(wpm: number) {
  return 60000 / wpm;
}

export default function IndexPage() {
  const paragraphs = useMemo(
    () => sampleText.map((p) => p.split(/\s+|(?<=[.,])/).filter(Boolean)),
    []
  );

  const totalWords = useMemo(() => paragraphs.reduce((sum, p) => sum + p.length, 0), [paragraphs]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wpm, setWpm] = useState(DEFAULT_WPM);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    if (running) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % totalWords);
      }, wpmToMs(wpm));
    }
    return clearTimer;
  }, [running, wpm, totalWords, clearTimer]);

  const handleReset = () => {
    setActiveIndex(0);
    setRunning(false);
  };

  const toggleRunning = () => setRunning((r) => !r);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleRunning();
      } else if (e.code === "KeyR") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const progress = totalWords > 0 ? ((activeIndex + 1) / totalWords) * 100 : 0;

  let wordCounter = 0;

  return (
    <>
      {/* Text display */}
      <div className="w-full pb-28 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
        {paragraphs.map((words, pIdx) => {
          const paragraphEl = (
            <p key={pIdx} className="mb-4">
              {words.map((word, wIdx) => {
                const globalIdx = wordCounter++;
                const isActive = globalIdx === activeIndex;
                return (
                  <span key={wIdx} className={isActive ? "text-accent" : "text-sub"}>
                    {word}{" "}
                  </span>
                );
              })}
            </p>
          );
          return paragraphEl;
        })}
      </div>

      {/* Fixed bottom hover zone — always interactive so mouse can reveal controls */}
      <div className="group fixed inset-x-0 bottom-0 pb-4 pt-8">
        <div
          className={`flex flex-col items-center gap-3 bg-bg/80 px-6 py-4 backdrop-blur-sm transition-all duration-300 ease-out ${running ? "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" : ""}`}
        >
          {/* Progress bar */}
          <div className="h-1 w-full max-w-3xl overflow-hidden rounded-full bg-bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sub tabular-nums" style={{ fontSize: "var(--text-label)" }}>
                {wpm}
              </span>
              <Slider.Root
                className="relative flex h-5 w-40 touch-none items-center select-none"
                value={[wpm]}
                onValueChange={([v]) => setWpm(v)}
                min={MIN_WPM}
                max={MAX_WPM}
                step={10}
              >
                <Slider.Track className="relative h-1 grow rounded-full bg-bg-surface">
                  <Slider.Range className="absolute h-full rounded-full bg-sub" />
                </Slider.Track>
                <Slider.Thumb className="block size-4 cursor-pointer rounded-full bg-text transition-colors hover:bg-accent focus:outline-none" />
              </Slider.Root>
              <span className="text-sub" style={{ fontSize: "var(--text-hint)" }}>
                wpm
              </span>
            </div>

            <button
              onClick={toggleRunning}
              className="flex size-10 items-center justify-center rounded-lg bg-bg-surface text-sub transition-colors hover:bg-accent hover:text-bg"
            >
              {running ? <Pause weight="bold" size={20} /> : <Play weight="bold" size={20} />}
            </button>

            <button
              onClick={handleReset}
              className="flex size-10 items-center justify-center rounded-lg bg-bg-surface text-sub transition-colors hover:bg-error hover:text-bg"
            >
              <ArrowCounterClockwise weight="bold" size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
