import Image from "next/image";
import React, { useRef, useState } from "react";
import { IoIosMail } from "react-icons/io";
import * as IGLogo from "../../public/instagram.png";
import * as PrintTip from "../../public/howToPrint.png";
import Spacer from "./utility/Spacer";
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
      className="absolute bottom-10 right-5 flex w-[16rem] flex-col items-center rounded-[10px] bg-white p-4 shadow-xl"
    >
      <h3 className="self-center text-center font-semibold">Contact Me</h3>

      <div className="flex flex-row items-center justify-between">
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
        onClick={() => dialogRef.current?.showModal()}
        className="mt-4 self-center rounded-[10px] bg-primary p-4 text-white transition-all duration-150 active:scale-95"
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
            unselect "Headers and Footers" and select "Background Graphics"
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

export default ContactMeModal;
