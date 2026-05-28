import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import ControlBar from "@/components/ReaderPage/ControlBar";
import TextDisplay from "@/components/TextDisplay";
import StatusBar from "@/components/ReaderPage/StatusBar";

import { useArticle } from "@/contexts/article/useArticle";

const DEFAULT_WPM = 300;

function wpmToMs(wpm: number) {
  return 60000 / wpm;
}

export default function ReadPage() {
  const navigate = useNavigate();
  const { paragraphs: rawParagraphs } = useArticle();

  const paragraphs = useMemo(
    () =>
      rawParagraphs.map((p) => {
        const tokens: string[] = [];
        const re = /\[equation(?::[^\]]*)\]/g;
        let lastIdx = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(p)) !== null) {
          const before = p.slice(lastIdx, m.index);
          if (before) tokens.push(...before.split(/\s+|(?<=[.,])/).filter(Boolean));
          tokens.push(m[0]);
          lastIdx = m.index + m[0].length;
        }
        const after = p.slice(lastIdx);
        if (after) tokens.push(...after.split(/\s+|(?<=[.,])/).filter(Boolean));
        return tokens.filter(Boolean);
      }),
    [rawParagraphs]
  );

  const totalWords = useMemo(
    () =>
      paragraphs.reduce((sum, p) => sum + p.filter((w) => !w.startsWith("[equation")).length, 0),
    [paragraphs]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [wpm, setWpm] = useState(DEFAULT_WPM);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopwatchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollPausedRef = useRef(false);
  const [prevParagraphs, setPrevParagraphs] = useState(rawParagraphs);
  const [elaspedTime, setElaspedTime] = useState(0);

  if (prevParagraphs !== rawParagraphs) {
    setPrevParagraphs(rawParagraphs);
    setActiveIndex(0);
    setRunning(false);
  }

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearStopwatch = useCallback(() => {
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
      stopwatchRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running) {
      stopwatchRef.current = setInterval(() => {
        setElaspedTime((prev) => prev + 1);
      }, 1000);
    } else clearStopwatch();
    return clearStopwatch;
  }, [running, clearStopwatch]);

  useEffect(() => {
    clearTimer();
    if (running) {
      intervalRef.current = setInterval(() => {
        if (!scrollPausedRef.current) {
          setActiveIndex((prev) => (prev + 1) % totalWords);
        }
      }, wpmToMs(wpm));
    }
    return clearTimer;
  }, [running, wpm, totalWords, clearTimer]);

  const handleReset = () => {
    setActiveIndex(0);
    setRunning(false);
    setElaspedTime(0);
  };

  const toggleRunning = () => {
    setRunning((r) => !r);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      scrollPausedRef.current = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        scrollPausedRef.current = false;
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleRunning();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const progress = totalWords > 0 ? ((activeIndex + 1) / totalWords) * 100 : 0;

  return (
    <div className="relative">
      <div className="sticky top-4 w-full bg-muted/90 rounded-lg">
        <StatusBar progress={progress} elaspedSeconds={elaspedTime} />
      </div>
      <TextDisplay paragraphs={paragraphs} activeIndex={activeIndex} />
      <ControlBar
        wpm={wpm}
        onWpmChange={setWpm}
        running={running}
        onToggleRunning={toggleRunning}
        onReset={handleReset}
        onQuiz={() => navigate("/qa")}
      />
    </div>
  );
}
