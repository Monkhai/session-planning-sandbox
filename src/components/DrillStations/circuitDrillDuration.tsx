import React, { useMemo } from "react";
import DurationPicker from "../DurationPicker";

interface Props {
  duration: string;
  durationString: string | undefined;
  showDuration: boolean;
  handledurationChange: (duration: string) => void;
  showDurationPicker: boolean;
  setShowDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const CircuitDrillDuration = ({
  duration,
  showDurationPicker,
  setShowDurationPicker,
  durationString,
  handledurationChange,
  showDuration,
}: Props) => {
  if (!showDuration) return null;

  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

  const durationStyleClasses = `
  pl-2 
  text-xs 
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
  text-xs
  font-semibold
  print:font-normal
  print:text-black
  print:text-xs

  ${
    !showDurationPicker
      ? durationString
        ? "text-[var(--color-text)]"
        : "text-[var(--color-dark-sub-title)]"
      : "text-[var(--color-blue)] font-bold"
  }
`;
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
          showDurationPicker={showDurationPicker}
          setShowDurationPicker={setShowDurationPicker}
          controlButtonRef={controlButtonRef}
          duration={duration}
          onDurationSubmit={handledurationChange}
        />
      </div>
    );
  }
};
export default CircuitDrillDuration;
