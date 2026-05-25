import { useCallback, useEffect, useRef, useState } from "react";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { Slider } from "radix-ui";

import { sampleText } from "@/utils/sampleText";

const HIGHLIGHT_COLOR = "text-blue-500";
const DEFAULT_WPM = 300;
const MIN_WPM = 60;
const MAX_WPM = 1000;

function wpmToMs(wpm: number) {
  return 60000 / wpm;
}

export default function IndexPage() {
  const words = sampleText.flatMap((paragraph) =>
    paragraph.split(/\s+|(?<=[.,])/).filter((w) => !!w)
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [wpm, setWpm] = useState(DEFAULT_WPM);
  const [running, setRunning] = useState(true);
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
        setActiveIndex((prev) => (prev + 1) % words.length);
      }, wpmToMs(wpm));
    }
    return clearTimer;
  }, [running, wpm, words.length, clearTimer]);

  const handleReset = () => {
    setActiveIndex(0);
    setRunning(false);
  };

  const [wordOffset, setWordOffset] = useState(0);

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums">{wpm} WPM</span>
        </div>

        <Slider.Root
          className="relative flex h-5 w-48 touch-none items-center select-none"
          value={[wpm]}
          onValueChange={([v]) => setWpm(v)}
          min={MIN_WPM}
          max={MAX_WPM}
          step={10}
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-neutral-200 dark:bg-neutral-700">
            <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
          </Slider.Track>
          <Slider.Thumb className="block size-4 rounded-full bg-blue-500 shadow focus:outline-none" />
        </Slider.Root>

        <div className="flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            {running ? <Pause weight="bold" size={16} /> : <Play weight="bold" size={16} />}
            {running ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
          >
            <ArrowCounterClockwise weight="bold" size={16} />
            Reset
          </button>
        </div>
      </div>

      {sampleText.map((e, i) => {
        const paragraphWords = e.split(/\s+|(?<=[.,])/).filter((w) => !!w);
        const startOffset = wordOffset;
        setWordOffset(wordOffset + paragraphWords.length);

        return (
          <p key={i}>
            {paragraphWords.map((word, j) => (
              <span key={j} className={startOffset + j === activeIndex ? HIGHLIGHT_COLOR : ""}>
                {word}{" "}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
