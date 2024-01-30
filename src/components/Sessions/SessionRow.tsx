import Link from "next/link";
import React, { useEffect } from "react";
import { IoChevronForward, IoCloseCircle } from "react-icons/io5";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import Spacer from "../utility/Spacer";
import SessionRowSettings from "./SessionRowSettings";

interface Props {
  session: any;
  index: number;
  isLast: boolean;
}

const SessionRow = ({ index, isLast, session }: Props) => {
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [sessionName, setSessionName] = React.useState("");
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (showSettingsModal) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showSettingsModal]);

  const toggleModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const handleUpdateSession = () => {
    dialogRef.current?.close();
    setShowSettingsModal(false);
    setSessionName("");
  };
  return (
    <div
      style={{
        borderBottomLeftRadius: isLast ? "10px" : "0px",
        borderBottomRightRadius: isLast ? "10px" : "0px",
        borderTopLeftRadius: index == 0 ? "10px" : "0px",
        borderTopRightRadius: index == 0 ? "10px" : "0px",
      }}
      className={
        !isLast
          ? "relative  flex h-[36px] w-full flex-row items-center border-b-[1px] border-b-seperator bg-white print:h-[35px] print:border-none print:p-2 print:py-0 md:h-[50px]  dark:bg-darkSecondaryBackground"
          : "relative  flex h-[36px] w-full flex-row items-center  bg-white   print:h-[35px] print:p-2 print:py-0 md:h-[50px] dark:bg-darkSecondaryBackground"
      }
      key={session.id}
    >
      <Link
        className="flex h-[36px] w-full flex-row items-center justify-between p-2 text-base md:h-[50px] md:p-4 md:text-xl"
        href={`/sessions/${session.id}`}
      >
        <p className={session.name ? "" : "text-gray dark:text-darkTextInput"}>
          {session.name ? session.name : "Nameless Session"}
        </p>
        <IoChevronForward className="h-3 w-3 md:h-5 md:w-5" color={"gray"} />
      </Link>

      <button
        onClick={toggleModal}
        className="absolute -left-10 flex justify-end text-base transition-all duration-150 ease-in-out active:scale-95 md:text-xl"
      >
        <PiDotsThreeCircleFill size={28} color={"gray"} />
      </button>

      <SessionRowSettings
        session={session}
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
      />
    </div>
  );
};

export default SessionRow;
