import React, { useMemo } from "react";
import DurationPicker from "../DurationPicker";

interface Props {
  duration: string;
  durationString: string | undefined;
  showDuration: boolean;
  handledurationChange: (duration: string) => void;
  hideDurationPicker: boolean;
  setHideDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const CircuitDrillDuration = ({
  duration,
  hideDurationPicker,
  setHideDurationPicker,
  durationString,
  handledurationChange,
  showDuration,
}: Props) => {
  if (!showDuration) return null;

  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const durationStyleClasses = `
  pl-2 
  text-xs 
  font-semibold
  print:font-normal
  print:text-black
  print:text-xs

  ${
    hideDurationPicker
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
    hideDurationPicker
      ? durationString
        ? "text-[var(--color-text)]"
        : "text-[var(--color-dark-sub-title)]"
      : "text-[var(--color-blue)] font-bold"
  }
`;
  if (showDuration) {
    return (
      <div className="relative flex justify-center md:justify-start">
        <button onClick={() => setHideDurationPicker(!hideDurationPicker)}>
          <p
            className={
              !isDarkTheme ? durationStyleClasses : darkDurationStyleClasses
            }
          >
            {durationString ? durationString : "Duration"}
          </p>
        </button>

        <div
          style={{
            transition: "all 0.150s ease-in-out",
            scale: hideDurationPicker ? 0 : 1,
            opacity: hideDurationPicker ? 0 : 1,
          }}
          className="absolute top-6 z-10 origin-top md:origin-top-left"
        >
          <DurationPicker
            hideDurationPicker={() => setHideDurationPicker(true)}
            duration={duration}
            onDurationSubmit={handledurationChange}
          />
        </div>
      </div>
    );
  }
};
export default CircuitDrillDuration;
