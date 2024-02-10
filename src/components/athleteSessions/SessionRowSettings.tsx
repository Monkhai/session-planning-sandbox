import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import useDeleteAthleteSession from "~/hooks/athletesHooks/useDeleteAthleteSession";
import useUpdateAthleteSession from "~/hooks/athletesHooks/useUpdateAthleteSession";
import { SessionFromDB } from "~/utils/types";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  session: SessionFromDB;
}

const SessionRowSettings = ({
  showSettingsModal,
  setShowSettingsModal,
  session,
}: Props) => {
  const [sessionName, setSessionName] = React.useState(session.name || "");

  const { mutate: updateSession } = useUpdateAthleteSession();
  const { mutate: deleteSession } = useDeleteAthleteSession();

  const { athlete_id, group_id } = useParams<{
    athlete_id: string;
    group_id: string;
  }>();

  useEffect(() => {
    setSessionName(session.name || "");
  }, [session]);

  const handleNameChange = () => {
    updateSession({
      athlete_id: athlete_id,
      group_id: group_id,
      session_id: session.id,
      name: sessionName,
    });
    setShowSettingsModal(false);
  };

  const handleDeleteSession = () => {
    deleteSession({
      athlete_id,
      group_id,
      session_id: session.id,
    });
    setShowSettingsModal(false);
  };

  return (
    <div className="z-10">
      <div
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
            <h3 className="font-lg flex-1 font-semibold">Session Settings</h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="transition-all duration-150 active:scale-95"
            >
              <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
            </button>
          </div>
          {/*  */}
          <div className="flex w-full flex-col items-start gap-2">
            <p>Change Session Name</p>
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
            onClick={handleDeleteSession}
            className="w-full rounded-[10px] bg-red-500 p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
          >
            Delete Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRowSettings;
