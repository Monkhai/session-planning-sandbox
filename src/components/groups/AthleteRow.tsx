import { Reorder, useDragControls } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { IoChevronForward } from "react-icons/io5";
import { AthleteWithOrder } from "~/utils/types";
import ReorderController from "../ReorderController";
import SettingsIcon from "../icons/SettingsIcon";
import AthleteRowSettings from "./AthleteRowSettings";

interface Props {
  athlete: AthleteWithOrder;
  index: number;
  isLast: boolean;
  handleReorderEnd: () => void;
}

const AthleteRow = ({ index, isLast, athlete, handleReorderEnd }: Props) => {
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const { group_id } = useParams<{ group_id: string }>();

  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

  const toggleModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const dragControls = useDragControls();

  return (
    <Reorder.Item
      dragControls={dragControls}
      dragListener={false}
      value={athlete}
      key={athlete.id}
      onDragEnd={handleReorderEnd}
      style={{
        borderBottomLeftRadius: isLast ? "10px" : "0px",
        borderBottomRightRadius: isLast ? "10px" : "0px",
        borderTopLeftRadius: index == 0 ? "10px" : "0px",
        borderTopRightRadius: index == 0 ? "10px" : "0px",
      }}
      className={
        !isLast
          ? "relative  flex h-[36px] w-full flex-row items-center border-b-[1px] border-b-seperator bg-white print:h-[35px] print:border-none print:p-2 print:py-0 md:h-[50px] dark:border-b-darkSeperator dark:bg-darkSecondaryBackground"
          : "relative  flex h-[36px] w-full flex-row items-center  bg-white   print:h-[35px] print:p-2 print:py-0 md:h-[50px] dark:bg-darkSecondaryBackground"
      }
    >
      <ReorderController controls={dragControls} />
      <Link
        className="flex h-[36px] w-full flex-row items-center justify-between p-2 text-base md:h-[50px] md:p-4 md:text-xl"
        href={`/groups/${group_id}/athletes/${athlete.id}`}
      >
        <p className={athlete.name ? "" : "text-gray dark:text-darkTextInput"}>
          {athlete.name ? athlete.name : "Nameless Session"}
        </p>
        <IoChevronForward className="h-3 w-3 md:h-5 md:w-5" color={"gray"} />
      </Link>

      <button
        ref={controlButtonRef}
        onClick={toggleModal}
        className="absolute -left-10 flex items-center justify-end transition-all duration-150 ease-in-out active:scale-95 md:-right-10 md:left-auto md:text-xl"
      >
        <SettingsIcon size={28} color={"gray"} />
      </button>

      <AthleteRowSettings
        athlete={athlete}
        showSettingsModal={showSettingsModal}
        controlButtonRef={controlButtonRef}
        setShowSettingsModal={setShowSettingsModal}
      />
    </Reorder.Item>
  );
};

export default AthleteRow;
