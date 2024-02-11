import React from "react";
import useModalControl from "~/hooks/useModalControl";

interface Props {
  onCreateSkillStation: () => void;
  onCreateDrillStation: () => void;
}

const CreateNewStationButton = ({
  onCreateDrillStation,
  onCreateSkillStation,
}: Props) => {
  const [showModal, setShowModal] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);
  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

  useModalControl(ref, showModal, setShowModal, controlButtonRef);

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateSkillStation = () => {
    onCreateSkillStation();
    toggleModal();
  };

  const handleCreateDrillStation = () => {
    onCreateDrillStation();
    toggleModal();
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={ref}
        style={{
          transformOrigin: "bottom",
          scale: showModal ? 1 : 0,
          transition: "all 0.150s ease-in-out",
        }}
        className="absolute -top-36 z-0 flex-col items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-xl dark:bg-darkTextInputBackground"
      >
        <div className="z-10 flex flex-col items-center justify-center">
          <button
            onClick={handleCreateSkillStation}
            className="h-16 w-60  bg-white transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
          >
            <p className="text-center text-lg text-primary transition-all duration-150 active:scale-95">
              Skill Based Station
            </p>
          </button>
          <div className="absolute h-[1px] w-full bg-seperatorSecondary dark:bg-darkSeperatorSecondary" />
          <button
            onClick={handleCreateDrillStation}
            className="h-16 w-60 bg-white transition-all duration-150 hover:bg-seperatorSecondary dark:bg-darkTextInputBackground"
          >
            <p className="text-center text-lg text-primary transition-all duration-150 active:scale-95">
              Drill Based Station
            </p>
          </button>
        </div>
      </div>

      {/*  */}

      <button
        ref={controlButtonRef}
        onClick={toggleModal}
        className="z-10 rounded-[10px] bg-primary p-3 transition-all duration-150 active:scale-95 md:p-4"
      >
        <p className="text-center text-base text-white md:text-lg">
          Create a New Station
        </p>
      </button>
    </div>
  );
};
export default React.memo(CreateNewStationButton);
