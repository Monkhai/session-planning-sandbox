import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import useDeleteAthlete from "~/hooks/athletesHooks/useDeleteAthlete";
import useUpdateAthlete from "~/hooks/athletesHooks/useUpdateAthlete";
import useModalControl from "~/hooks/useModalControl";
import { AthleteFromDB } from "~/utils/types";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
  athlete: AthleteFromDB;
}

const AthleteRowSettings = ({
  showSettingsModal,
  setShowSettingsModal,
  controlButtonRef,
  athlete,
}: Props) => {
  const params = useParams<{ group_id: string; athlete_id: string }>();
  const [athleteName, setAthleteName] = React.useState(athlete.name || "");

  const { mutate: updateAthlete } = useUpdateAthlete();
  const { mutate: deleteAthlete } = useDeleteAthlete();

  useEffect(() => {
    setAthleteName(athlete.name || "");
  }, [athlete]);

  const handleNameChange = () => {
    updateAthlete({
      name: athleteName,
      athlete_id: params.athlete_id,
      group_id: params.group_id,
    });
    setShowSettingsModal(false);
  };

  const handleDeletegroup = () => {
    setShowSettingsModal(false);
    deleteAthlete({ athlete_id: athlete.id, group_id: params.group_id });
  };

  const ref = React.useRef<HTMLDivElement>(null);
  useModalControl(
    ref,
    showSettingsModal,
    setShowSettingsModal,
    controlButtonRef,
  );

  return (
    <div className="z-10">
      <div
        ref={ref}
        style={{
          transition: "all 0.150s ease-in-out",
          scale: showSettingsModal ? 1 : 0,
          opacity: showSettingsModal ? 1 : 0,
        }}
        className="absolute -left-2 top-8 w-60 origin-top-left md:-right-2 md:left-auto md:top-10 md:w-80 md:origin-top-right"
      >
        <div className="flex w-full flex-col items-start gap-2 rounded-[10px] border-2 border-seperator bg-white p-4 shadow-xl dark:border-darkSeperator dark:bg-darkSecondaryBackground">
          <div className="flex w-full flex-1 flex-row justify-between pb-2">
            <h3 className="font-lg flex-1 font-semibold">group Settings</h3>
            <button
              tabIndex={showSettingsModal ? 0 : -1}
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
              tabIndex={showSettingsModal ? 0 : -1}
              className="w-full rounded-[10px] bg-textInputBackground p-2 text-base outline-none placeholder:text-base md:text-xl md:placeholder:text-xl"
              type="text"
              placeholder="Athlete Name"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value)}
            />
          </div>
          {athlete.name !== athleteName ? (
            <button
              tabIndex={showSettingsModal ? 0 : -1}
              onClick={handleNameChange}
              className="w-full rounded-[10px] bg-primary p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
            >
              Update Athlete
            </button>
          ) : null}
          <button
            tabIndex={showSettingsModal ? 0 : -1}
            onClick={handleDeletegroup}
            className="w-full rounded-[10px] bg-red-500 p-2 text-white transition-all duration-150 ease-in-out active:scale-95"
          >
            Delete athlete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AthleteRowSettings;
