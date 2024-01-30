import React, { useMemo } from "react";
import DurationPicker from "./DurationPicker";

interface Props {
  duration: string;
  durationString: string | undefined;
  showDuration: boolean;
  handledurationChange: (duration: string) => void;
  hideDurationPicker: boolean;
  setHideDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const StationDuration = ({
  duration,
  hideDurationPicker,
  setHideDurationPicker,
  durationString,
  handledurationChange,
  showDuration,
}: Props) => {
  if (!showDuration) return null;

  const isDarkTheme = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false; // Default value or logic for server-side
  }, [window]);

  const durationStyleClasses = `
  pl-2 
  text-sm 
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
  text-sm 
  font-semibold
  print:font-normal
  print:text-black
  print:text-xs

  ${
    hideDurationPicker
      ? durationString
        ? "text-[var(--color-text)]"
        : "text-[var(--color-dark-text-input)]"
      : "text-[var(--color-blue)] font-bold"
  }
`;
  if (showDuration) {
    return (
      <div>
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
          className="absolute z-10 w-80"
          style={{
            transition: "all 0.150s ease-in-out",
            scale: hideDurationPicker ? 0 : 1,
            opacity: hideDurationPicker ? 0 : 1,
            transformOrigin: "top left",
          }}
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
export default StationDuration;
