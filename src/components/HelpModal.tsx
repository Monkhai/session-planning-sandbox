import Image from "next/image";
import React, { useRef } from "react";
import FormLink from "~/utils/FormLink";
import * as PrintTip from "../../public/howToPrint.png";

interface Props {
  showContact: boolean;
  onLogout: () => void;
}

const HelpModal = ({ showContact, onLogout }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div
      style={{
        scale: showContact ? 1 : 0,
        opacity: showContact ? 1 : 0,
        transformOrigin: "bottom right",
        transition: "all 0.150s ease",
      }}
      className="absolute  bottom-10 right-5 z-10 h-auto flex-col items-center justify-center overflow-hidden rounded-[10px] bg-white text-base shadow-xl md:text-base dark:bg-darkTextInputBackground"
    >
      <button className="h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground">
        <a target="_blank" rel="noopener noreferrer" href={FormLink}>
          Provide Feedback
        </a>
      </button>
      <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
      <button
        className="h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
        onClick={() => dialogRef.current?.showModal()}
      >
        Teach me how to print
      </button>
      <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
      <button
        className="h-16 w-60 bg-white text-red-500 transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
        onClick={onLogout}
      >
        Logout
      </button>

      <dialog
        ref={dialogRef}
        className=" h-3/4 w-[90%] overflow-hidden rounded-[10px] p-4 shadow-xl transition-all duration-150 md:h-3/5 md:w-1/4 dark:bg-darkSecondaryBackground"
      >
        <div className="flex h-full flex-1 flex-col items-center justify-between">
          <h4 className="md:w-3/4">
            After clicking <b>ctrl + P</b> or <b>cmd + P</b> make sure to{" "}
            <u>unselect</u> "Headers and Footers".
          </h4>
          <Image src={PrintTip} className="rounded-[10px]" alt="How to print" />
          <button
            onClick={() => dialogRef.current?.close()}
            className="self-center rounded-[10px] bg-primary p-3 text-white transition-all duration-150 active:scale-95 md:p-4"
          >
            Got it!
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default React.memo(HelpModal);
