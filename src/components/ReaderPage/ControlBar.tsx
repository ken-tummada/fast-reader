import { useNavigate } from "react-router";
import {
  ArrowCounterClockwiseIcon,
  PauseIcon,
  PlayIcon,
  SparkleIcon,
  XIcon,
} from "@phosphor-icons/react";

import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";

const MIN_WPM = 200;
const MAX_WPM = 600;
const INTV_WPM = 50;

interface ControlBarProps {
  wpm: number;
  onWpmChange: (value: number) => void;
  running: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onQuiz?: () => void;
}

export default function ControlBar({
  wpm,
  onWpmChange,
  running,
  onToggleRunning,
  onReset,
  onQuiz,
}: ControlBarProps) {
  const navigte = useNavigate();
  return (
    <div className="group max-w-[70ch] fixed inset-x-0 left-1/2 -translate-x-1/2 bottom-0 pb-4 pt-8">
      <div
        className={`bg-muted/60 rounded-lg px-6 py-4 backdrop-blur-sm transition-all duration-300 ease-out ${running ? "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <Button variant={"destructive"} size={"icon"} onClick={() => navigte("/")}>
              <XIcon size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[wpm]}
              min={MIN_WPM}
              max={MAX_WPM}
              step={INTV_WPM}
              onValueChange={([v]) => onWpmChange(v)}
            />
            <span className="text-sub tabular-nums" style={{ fontSize: "var(--text-label)" }}>
              {wpm} wpm
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              variant={"secondary"}
              size={"icon"}
              tooltip="Start"
              tooltipSide="top"
              onClick={onToggleRunning}
            >
              {running ? (
                <PauseIcon weight="fill" size={20} />
              ) : (
                <PlayIcon weight="fill" size={20} />
              )}
            </Button>
            <Button
              variant={"secondary"}
              size={"icon"}
              tooltip="Restart"
              tooltipSide="top"
              onClick={onReset}
            >
              <ArrowCounterClockwiseIcon weight="bold" size={20} />
            </Button>
            {onQuiz && (
              <Button
                variant={"secondary"}
                size={"icon"}
                tooltip="Q&A"
                tooltipSide="top"
                onClick={onQuiz}
              >
                <SparkleIcon weight="fill" size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
