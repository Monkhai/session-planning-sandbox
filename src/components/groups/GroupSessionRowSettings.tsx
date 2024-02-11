import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import useDeleteGroupSession from "~/hooks/groupSessionHooks/useDeleteGroupSession";
import useUpdateGroupSession from "~/hooks/groupSessionHooks/useUpdateGroupSession";
import useModalControl from "~/hooks/useModalControl";
import { SessionFromDB } from "~/utils/types";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
  session: SessionFromDB;
}

const GroupSessionRowSettings = ({
  showSettingsModal,
  setShowSettingsModal,
  controlButtonRef,
  session,
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useModalControl(
    ref,
    showSettingsModal,
    setShowSettingsModal,
    controlButtonRef,
  );

  const params = useParams<{ group_id: string }>();
  const [sessionName, setSessionName] = React.useState(session.name || "");

  const { mutate: updateSession } = useUpdateGroupSession();
  const { mutate: deleteSession } = useDeleteGroupSession();

  useEffect(() => {
    setSessionName(session.name || "");
  }, [session]);

  const handleNameChange = () => {
    setShowSettingsModal(false);
    updateSession({
      session_id: session.id,
      name: sessionName,
      group_id: params.group_id,
    });
  };

  const handleDeleteGroupSession = () => {
    setShowSettingsModal(false);
    deleteSession({ session_id: session.id, group_id: params.group_id });
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
              <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
            </button>
          </div>
          {/*  */}
          <div className="flex w-full flex-col items-start gap-2">
            <p>Change group Name</p>
            <input
              className="w-full rounded-[10px] bg-textInputBackground p-2 text-base outline-none placeholder:text-base md:text-xl md:placeholder:text-xl"
              type="text"
              placeholder="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>
          {session.name !== sessionName ? (
            <button
              onClick={handleNameChange}
              className="w-full rounded-[10px] bg-primary p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
            >
              Update Session
            </button>
          ) : null}
          <button
            onClick={handleDeleteGroupSession}
            className="w-full rounded-[10px] bg-red-500 p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
          >
            Delete Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSessionRowSettings;
