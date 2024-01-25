import Image from "next/image";
import { useRef } from "react";
import FormLink from "~/utils/FormLink";
import * as PrintTip from "../../public/howToPrint.png";
import Spacer from "./utility/Spacer";
import React from "react";
interface Props {
  showContact: boolean;
}

const ContactMeModal = ({ showContact }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div
      style={{
        scale: showContact ? 1 : 0,
        opacity: showContact ? 1 : 0,
        transformOrigin: "bottom right",
        transition: "all 0.150s ease",
      }}
      className="dark:bg-darkTextInputBackground absolute bottom-10 right-5 h-32 flex-col items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-xl"
    >
      <button className="dark:bg-darkTextInputBackground h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary">
        <a target="_blank" rel="noopener noreferrer" href={FormLink}>
          Provide Feedback
        </a>
      </button>
      <div className="dark:bg-darkSeperatorSecondary absolute h-[1px] w-full bg-seperatorSecondary" />
      <button
        className="dark:bg-darkTextInputBackground h-16 w-60 bg-white text-primary transition-all duration-150 hover:bg-seperatorSecondary"
        onClick={() => dialogRef.current?.showModal()}
      >
        Remind me how to print
      </button>

      <dialog
        ref={dialogRef}
        className="h-3/5 w-1/4 overflow-hidden rounded-[10px] p-4 shadow-xl transition-all duration-150"
      >
        <div className="flex h-full flex-1 flex-col items-center justify-start">
          <h4 className="w-3/4">
            After clicking <b>ctrl + P</b> or <b>cmd + P</b> make sure to
            unselect "Headers and Footers".
          </h4>
          <Image src={PrintTip} alt="How to print" />
          <Spacer />
          <button
            onClick={() => dialogRef.current?.close()}
            className="mt-4 self-center rounded-[10px] bg-primary p-4 text-white transition-all duration-150 active:scale-95"
          >
            Got it!
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default React.memo(ContactMeModal);
