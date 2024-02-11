import React, { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import useModalControl from "~/hooks/useModalControl";
import {
  convertDurationToNumberOfMinutes,
  convertNumberOfMinutesToDuration,
} from "~/services/DurationFunctions";

interface Props {
  duration: string | null;
  onDurationSubmit: (duration: string) => void;
  showDurationPicker: boolean;
  setShowDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
}

const DurationPicker = ({
  duration,
  onDurationSubmit,
  showDurationPicker,
  setShowDurationPicker,
  controlButtonRef,
}: Props) => {
  const [numberOfMinutes, setNumberOfMinutes] = useState<number>(0);
  const ref = React.useRef(null);

  useModalControl(
    ref,
    showDurationPicker,
    setShowDurationPicker,
    controlButtonRef,
  );

  useEffect(() => {
    if (duration) {
      const newNumberOfMinutes = convertDurationToNumberOfMinutes(duration);
      setNumberOfMinutes(newNumberOfMinutes);
    }
  }, [duration]);

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumberOfMinutes = parseInt(event.target.value);
    if (newNumberOfMinutes >= 0) {
      setNumberOfMinutes(newNumberOfMinutes);
    } else {
      setNumberOfMinutes(0);
    }
  };

  const handleSubmit = () => {
    const newDuration = convertNumberOfMinutesToDuration(numberOfMinutes);
    onDurationSubmit(newDuration);
    setShowDurationPicker(false);
  };

  return (
    <div
      ref={ref}
      className="absolute z-10 w-80"
      style={{
        transition: "all 0.150s ease-in-out",
        scale: showDurationPicker ? 1 : 0,
        opacity: showDurationPicker ? 1 : 0,
        transformOrigin: "top left",
      }}
    >
      <div className="z-50 flex w-60 flex-col gap-4 rounded-[10px] border-2 border-seperator bg-white p-4 shadow-xl print:hidden md:w-80 dark:border-darkSeperator dark:bg-darkSecondaryBackground">
        <div className="flex flex-row justify-between">
          <p className="font-semibold">Set Duration (in minutes)</p>
          <button
            tabIndex={showDurationPicker ? 0 : -1}
            onClick={() => setShowDurationPicker(false)}
          >
            <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
          </button>
        </div>
        <input
          tabIndex={showDurationPicker ? 0 : -1}
          type="number"
          value={numberOfMinutes ? numberOfMinutes : ""}
          placeholder={numberOfMinutes.toString()}
          onChange={handleMinutesChange}
          className="mt-2 w-full rounded-[8px] bg-textInputBackground p-2 focus:outline-none active:outline-none dark:bg-darkSecondaryTextInputBackground"
        />
        <button
          tabIndex={showDurationPicker ? 0 : -1}
          onClick={handleSubmit}
          className="rounded-[12px] bg-primary px-4 py-2 transition-all duration-150 active:scale-95"
        >
          <p className="text-white">Set</p>
        </button>
      </div>
    </div>
  );
};

export default DurationPicker;
