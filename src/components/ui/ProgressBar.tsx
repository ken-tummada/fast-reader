import { Progress } from "radix-ui";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <Progress.Root
      className="w-full h-2.5 relative overflow-hidden bg-background rounded-full translate-z-0"
      value={progress}
    >
      <Progress.Indicator
        className="bg-foreground size-full transition-transform rounded-full"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
