import React, { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import {
  convertDurationToNumberOfMinutes,
  convertNumberOfMinutesToDuration,
} from "~/services/DurationFunctions";

interface Props {
  duration: string | null;
  onDurationSubmit: (duration: string) => void;
  hideDurationPicker: () => void;
}

const DurationPicker = ({
  duration,
  onDurationSubmit,
  hideDurationPicker,
}: Props) => {
  const [numberOfMinutes, setNumberOfMinutes] = useState<number>(0);

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
    hideDurationPicker();
  };

  return (
    <div className="dark:bg-darkSecondaryBackground z-50 flex w-80 flex-col gap-4 rounded-[10px] bg-white p-4 shadow-xl print:hidden">
      <div className="flex flex-row justify-between">
        <p className="font-semibold">Set Duration (in minutes)</p>
        <button onClick={hideDurationPicker}>
          <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
        </button>
      </div>
      <input
        type="number"
        value={numberOfMinutes ? numberOfMinutes : ""}
        placeholder={numberOfMinutes.toString()}
        onChange={handleMinutesChange}
        className="bg-textInputBackground dark:bg-darkTextInputBackground mt-2 w-full rounded-[8px] p-2 focus:outline-none active:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="rounded-[12px] bg-primary px-4 py-2 transition-all duration-150 active:scale-95"
      >
        <p className="text-white">Set</p>
      </button>
    </div>
  );
};

export default DurationPicker;
