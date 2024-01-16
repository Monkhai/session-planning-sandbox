import React, { useContext } from "react";
import DurationPicker from "./DurationPicker";
import { FetchContext } from "~/context/FetchContext";

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
  const { fetchStatus } = useContext(FetchContext);

  if (!showDuration) return null;
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
  if (showDuration) {
    return (
      <>
        <button
          disabled={fetchStatus === "fetching"}
          onClick={() => setHideDurationPicker(!hideDurationPicker)}
        >
          <p className={durationStyleClasses}>
            {durationString ? durationString : "Duration"}
          </p>
        </button>

        <div
          className="absolute z-10 mt-2 w-80"
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
      </>
    );
  }
};
export default React.memo(StationDuration);
