import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { IoChevronForward } from "react-icons/io5";
import { SessionWithOrder } from "~/utils/types";
import SettingsIcon from "../icons/SettingsIcon";
import GroupSessionRowSettings from "./GroupSessionRowSettings";
import { Reorder, useDragControls } from "framer-motion";
import ReorderController from "../ReorderController";

interface Props {
  session: SessionWithOrder;
  index: number;
  isLast: boolean;
  handleReorderEnd: () => void;
}

const GroupSessionRow = ({
  index,
  isLast,
  session,
  handleReorderEnd,
}: Props) => {
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const controlButtonRef = React.useRef<HTMLButtonElement>(null);
  const { group_id } = useParams<{ group_id: string }>();

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
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      dragControls={dragControls}
      dragListener={false}
      value={session}
      key={session.id}
      style={{
        borderBottomLeftRadius: isLast ? "10px" : "0px",
        borderBottomRightRadius: isLast ? "10px" : "0px",
        borderTopLeftRadius: index == 0 ? "10px" : "0px",
        borderTopRightRadius: index == 0 ? "10px" : "0px",
      }}
      className={
        !isLast
          ? "relative flex h-[36px] w-full flex-row items-center border-b-[1px] border-b-seperator bg-white print:h-[35px] print:border-none print:p-2 print:py-0 md:h-[50px]  dark:border-b-darkSeperator dark:bg-darkSecondaryBackground"
          : "relative flex h-[36px] w-full flex-row items-center bg-white   print:h-[35px] print:p-2 print:py-0 md:h-[50px] dark:bg-darkSecondaryBackground"
      }
    >
      <ReorderController
        controls={dragControls}
        handleReorderEnd={handleReorderEnd}
      />
      <Link
        className="flex h-[36px] w-full flex-row items-center justify-between p-2 text-base md:h-[50px] md:p-4 md:text-xl"
        href={`/groups/${group_id}/group-sessions/${session.id}`}
      >
        <p className={session.name ? "" : "text-gray dark:text-darkTextInput"}>
          {session.name ? session.name : "Nameless Session"}
        </p>
        <IoChevronForward className="h-3 w-3 md:h-5 md:w-5" color={"gray"} />
      </Link>

      <button
        onClick={toggleModal}
        ref={controlButtonRef}
        className="absolute -left-10 flex justify-end text-base transition-all duration-150 ease-in-out active:scale-95 md:text-xl"
      >
        <SettingsIcon size={28} color={"gray"} />
      </button>

      <GroupSessionRowSettings
        controlButtonRef={controlButtonRef}
        session={session}
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
      />
    </Reorder.Item>
  );
};

export default GroupSessionRow;
