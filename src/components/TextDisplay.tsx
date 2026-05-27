interface TextDisplayProps {
  paragraphs: string[][];
  activeIndex: number;
}

const isMathToken = (word: string): boolean => word.startsWith("[equation");

const getMathContent = (word: string): string => {
  const m = word.match(/^\[equation:([^\]]*)\]$/);
  return m ? m[1] : "";
};

export default function TextDisplay({ paragraphs, activeIndex }: TextDisplayProps) {
  let wordCounter = 0;

  return (
    <div className="w-full pb-28 leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
      {paragraphs.map((words, pIdx) => {
        const isBlockEquation = words.length === 1 && isMathToken(words[0]);

        if (isBlockEquation) {
          const content = getMathContent(words[0]);
          return (
            <p key={pIdx} className="my-6 text-center text-sub/60 italic">
              {content || "[equation]"}
            </p>
          );
        }

        return (
          <p key={pIdx} className="mb-4">
            {words.map((word, wIdx) => {
              const isEquation = isMathToken(word);
              const globalIdx = isEquation ? -1 : wordCounter++;
              const isActive = !isEquation && globalIdx === activeIndex;

              return (
                <span
                  key={wIdx}
                  className={
                    isEquation
                      ? "text-sub/60 italic"
                      : isActive
                        ? "text-primary-foreground"
                        : "text-sub"
                  }
                >
                  {isEquation ? getMathContent(word) || "[equation]" : word}{" "}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
