import { ArrowCounterClockwiseIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { Slider } from "radix-ui";

import ProgressBar from "@/components/ProgressBar";

const MIN_WPM = 150;
const MAX_WPM = 1000;

interface ControlBarProps {
  progress: number;
  wpm: number;
  onWpmChange: (value: number) => void;
  running: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
}

export default function ControlBar({
  progress,
  wpm,
  onWpmChange,
  running,
  onToggleRunning,
  onReset,
}: ControlBarProps) {
  return (
    <div className="group fixed inset-x-0 bottom-0 pb-4 pt-8">
      <div
        className={`flex flex-col items-center gap-3 bg-bg/80 px-6 py-4 backdrop-blur-sm transition-all duration-300 ease-out ${running ? "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" : ""}`}
      >
        <ProgressBar progress={progress} />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sub tabular-nums" style={{ fontSize: "var(--text-label)" }}>
              {wpm}
            </span>
            <Slider.Root
              className="relative flex h-5 w-40 touch-none items-center select-none"
              value={[wpm]}
              onValueChange={([v]) => onWpmChange(v)}
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
            onClick={onToggleRunning}
            className="flex size-10 items-center justify-center rounded-lg bg-bg-surface text-sub transition-colors hover:bg-accent hover:text-bg"
          >
            {running ? <PauseIcon weight="bold" size={20} /> : <PlayIcon weight="bold" size={20} />}
          </button>

          <button
            onClick={onReset}
            className="flex size-10 items-center justify-center rounded-lg bg-bg-surface text-sub transition-colors hover:bg-error hover:text-bg"
          >
            <ArrowCounterClockwiseIcon weight="bold" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
