import Image from "next/image";
import React from "react";
import { IoIosMail } from "react-icons/io";
import * as IGLogo from "../../public/instagram.png";
interface Props {
  showContact: boolean;
}

const ContactMeModal = ({ showContact }: Props) => {
  return (
    <div
      style={{
        scale: showContact ? 1 : 0,
        opacity: showContact ? 1 : 0,
        transformOrigin: "bottom right",
        transition: "all 0.150s ease",
      }}
      className="absolute bottom-10 right-5 w-48 flex-col rounded-[10px] bg-white p-4 shadow-xl"
    >
      <h4 className="self-center text-center font-semibold">Contact Me</h4>

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
    </div>
  );
};

export default ContactMeModal;
