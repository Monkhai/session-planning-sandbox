import React, { useMemo } from "react";
import DurationPicker from "./DurationPicker";

interface Props {
  duration: string;
  durationString: string | undefined;
  showDuration: boolean;
  handledurationChange: (duration: string) => void;
  showDurationPicker: boolean;
  setShowDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const StationDuration = ({
  duration,
  showDurationPicker,
  setShowDurationPicker,
  durationString,
  handledurationChange,
  showDuration,
}: Props) => {
  if (!showDuration) return null;

  const isDarkTheme = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }, [window]);

  const durationStyleClasses = `
  pl-2 
  text-sm 
  font-semibold
  print:font-normal
  print:text-black
  print:text-xs

  ${
    !showDurationPicker
      ? durationString
        ? "text-[var(--color-text)]"
        : "text-[var(--color-gray)]"
      : "text-[var(--color-blue)] font-bold"
  }
`;
  const darkDurationStyleClasses = `
  pl-2 
  text-sm 
  font-semibold
  print:font-normal
  print:text-black
  print:text-xs

  ${
    !showDurationPicker
      ? durationString
        ? "text-[var(--color-text)]"
        : "text-[var(--color-dark-text-input)]"
      : "text-[var(--color-blue)] font-bold"
  }
`;

  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

  if (showDuration) {
    return (
      <div>
        <button
          ref={controlButtonRef}
          onClick={() => setShowDurationPicker(!showDurationPicker)}
        >
          <p
            className={
              !isDarkTheme ? durationStyleClasses : darkDurationStyleClasses
            }
          >
            {durationString ? durationString : "Duration"}
          </p>
        </button>
        <DurationPicker
          controlButtonRef={controlButtonRef}
          showDurationPicker={showDurationPicker}
          setShowDurationPicker={setShowDurationPicker}
          duration={duration}
          onDurationSubmit={handledurationChange}
        />
      </div>
    );
  }
};
export default StationDuration;
