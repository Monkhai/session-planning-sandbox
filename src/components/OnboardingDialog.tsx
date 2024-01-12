import React from "react";
import {
  onBoardText1,
  onBoardText2,
  onBoardText3,
  onBoardText4,
  onBoardTextList,
} from "~/utils/onBoardText";
import Spacer from "./utility/Spacer";

interface Props {
  dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
  onOnboardSeen: () => void;
}

const OnboardingDialog = ({ dialogRef, onOnboardSeen }: Props) => {
  return (
    <dialog
      ref={dialogRef}
      className="h-4/5 w-3/5 overflow-hidden rounded-[10px] shadow-xl transition-all duration-150"
    >
      <div className="flex h-full w-full flex-1 flex-col items-center justify-start gap-4 self-center overflow-scroll p-4 px-60 text-center">
        <h1 className="self-center text-center">{onBoardText1}</h1>

        <h2>{onBoardText2}</h2>

        <ol className="w-1/2 list-inside list-decimal text-left text-xl">
          {onBoardTextList.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>

        <Spacer />
        <h3>{onBoardText3}</h3>
        <Spacer />
        <h3> {onBoardText4}</h3>
        <Spacer />

        <button
          onClick={onOnboardSeen}
          className="self-center rounded-[12px] bg-primary p-4 transition-all duration-150 active:scale-95 print:hidden"
        >
          <p className="text-center text-lg text-white">Got it!</p>
        </button>
      </div>
    </dialog>
  );
};

export default OnboardingDialog;
