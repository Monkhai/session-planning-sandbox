import Image from "next/image";
import React from "react";
import { IoIosMail } from "react-icons/io";
import {
  onBoardText1,
  onBoardText2,
  onBoardText3,
  onBoardTextList,
} from "~/utils/onBoardText";
import * as IGLogo from "../../public/instagram.png";
import * as howToPrint from "../../public/howToPrint.png";
import Spacer from "./utility/Spacer";

interface Props {
  dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
  onOnboardSeen: () => void;
}

const OnboardingDialog = ({ dialogRef, onOnboardSeen }: Props) => {
  return (
    <dialog
      ref={dialogRef}
      className="h-4/5 w-3/4 overflow-hidden rounded-[10px] shadow-xl transition-all duration-150"
    >
      <div className="flex h-full w-full flex-1 flex-col items-start justify-start gap-4 self-center overflow-scroll p-4 px-60">
        <h1>{onBoardText1}</h1>

        <h2>{onBoardText2}</h2>

        <ol className="w-1/2 list-inside list-decimal text-xl">
          {onBoardTextList.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>

        <p>
          To print properly, apply the following settings in the print settings
          (appear when you press ctl + P/ cmd + P)
        </p>
        <Image src={howToPrint} priority alt="How to print" />

        <Spacer />

        <h3>{onBoardText3}</h3>

        <div className="flex w-1/2 flex-row items-center justify-between self-center pb-4">
          <a type="email" href="mailto:yohaiwiener@gmail.com">
            <IoIosMail size={70} color={"black"} />
          </a>
          <a
            href="https://www.instagram.com/yohai_wiener"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image alt="Instagram logo" src={IGLogo} width={50} height={50} />
          </a>
        </div>
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
