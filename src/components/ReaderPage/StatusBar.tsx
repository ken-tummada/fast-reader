import ProgressBar from "@/components/ui/ProgressBar";
import Text from "@/components/shared/Text";

interface StatusBarProps {
  progress: number;
  elaspedSeconds: number;
}

const formatElapsed = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

function StatusBar({ progress, elaspedSeconds }: StatusBarProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex justify-center">
        <Text>{`${formatElapsed(elaspedSeconds)}`}</Text>
      </div>
      <div className="flex items-center gap-4">
        <ProgressBar progress={progress} />
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export default StatusBar;
