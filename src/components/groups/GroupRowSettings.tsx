import React, { useEffect } from "react";
import useDeleteGroup from "~/hooks/groupsHooks/useDeleteGroup";
import useUpdateGroup from "~/hooks/groupsHooks/useUpdateGroup";
import useModalControl from "~/hooks/useModalControl";
import { GroupFromDB } from "~/utils/types";
import CloseIcon from "../icons/CloseIcon";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  group: GroupFromDB;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
}

const GroupRowSettings = ({
  showSettingsModal,
  setShowSettingsModal,
  group,
  controlButtonRef,
}: Props) => {
  const [groupName, setgroupName] = React.useState(group.name || "");

  const { mutate: updateGroup } = useUpdateGroup();
  const { mutate: deleteGroup } = useDeleteGroup();

  const ref = React.useRef<HTMLDivElement>(null);
  useModalControl(
    ref,
    showSettingsModal,
    setShowSettingsModal,
    controlButtonRef,
  );

  useEffect(() => {
    setgroupName(group.name || "");
  }, [group]);

  const handleNameChange = () => {
    updateGroup({ group_id: group.id, name: groupName, order: group.order });
    setShowSettingsModal(false);
  };

  const handleDeletegroup = () => {
    deleteGroup(group.id);
    setShowSettingsModal(false);
  };

  return (
    <div className="z-10">
      <div
        ref={ref}
        className="absolute -left-2 top-8 w-60 md:top-10 md:w-80"
        style={{
          transition: "all 0.150s ease-in-out",
          scale: showSettingsModal ? 1 : 0,
          opacity: showSettingsModal ? 1 : 0,
          transformOrigin: "top left",
        }}
      >
        <div className="flex w-full flex-col items-start gap-2 rounded-[10px] border-2 border-seperator bg-white p-4 shadow-xl dark:border-darkSeperator dark:bg-darkSecondaryBackground">
          <div className="flex w-full flex-1 flex-row justify-between pb-2">
            <h3 className="font-lg flex-1 font-semibold">group Settings</h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="transition-all duration-150 active:scale-95"
            >
              <CloseIcon size={22} color={"red"} />
            </button>
          </div>
          {/*  */}
          <div className="flex w-full flex-col items-start gap-2">
            <p>Change group Name</p>
            <input
              className="w-full rounded-[10px] bg-textInputBackground p-2 text-base outline-none placeholder:text-base md:text-xl md:placeholder:text-xl"
              type="text"
              placeholder="group Name"
              value={groupName}
              onChange={(e) => setgroupName(e.target.value)}
            />
          </div>
          {group.name !== groupName ? (
            <button
              onClick={handleNameChange}
              className="w-full rounded-[10px] bg-primary p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
            >
              Update group
            </button>
          ) : null}
          <button
            onClick={handleDeletegroup}
            className="w-full rounded-[10px] bg-red-500 p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
          >
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupRowSettings;
