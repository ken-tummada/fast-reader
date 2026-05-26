import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ControlBar from "@/components/ControlBar";
import TextDisplay from "@/components/TextDisplay";
import { useArticle } from "@/hooks/useArticle";

const DEFAULT_WPM = 300;

function wpmToMs(wpm: number) {
  return 60000 / wpm;
}

export default function ReadPage() {
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
  const [prevParagraphs, setPrevParagraphs] = useState(rawParagraphs);

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

  return (
    <>
      <TextDisplay paragraphs={paragraphs} activeIndex={activeIndex} />
      <ControlBar
        progress={progress}
        wpm={wpm}
        onWpmChange={setWpm}
        running={running}
        onToggleRunning={toggleRunning}
        onReset={handleReset}
      />
    </>
  );
}
