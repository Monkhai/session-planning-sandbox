import React from "react";
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

  if (showDuration) {
    return (
      <>
        <button onClick={() => setHideDurationPicker(!hideDurationPicker)}>
          <p
            style={{
              color: hideDurationPicker
                ? durationString
                  ? "var(--color-text)"
                  : "var(--color-gray)"
                : "var(--color-blue)",
              fontWeight: hideDurationPicker ? "" : "bold",
            }}
            className="pl-2 text-sm font-semibold"
          >
            {durationString ? durationString : "Duration"}
          </p>
        </button>

        <div
          className="absolute mt-2 w-80"
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
