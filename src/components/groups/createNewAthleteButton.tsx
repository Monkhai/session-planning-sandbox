import React, { useCallback, useEffect } from "react";
import CloseIcon from "../icons/CloseIcon";

interface Props {
  onCreateNewAthlete: (name: string) => void;
}

const createNewAthleteButton = ({ onCreateNewAthlete }: Props) => {
  const [athleteName, setAthleteName] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
    } else {
      dialogRef.current?.close();
      if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
      }
    }
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateAthlete = useCallback(() => {
    dialogRef.current?.close();
    setIsModalOpen(false);
    setAthleteName("");
    onCreateNewAthlete(athleteName);
  }, [onCreateNewAthlete, athleteName, setIsModalOpen]);

  return (
    <div className="relative flex items-center justify-center">
      {isModalOpen ? (
        <dialog
          onClose={() => {
            setAthleteName("");
            toggleModal();
          }}
          ref={dialogRef}
          className="relative z-20 flex h-60 flex-col items-center justify-around overflow-hidden rounded-[10px] bg-white p-4 shadow-xl md:h-80 md:w-1/2 dark:bg-darkSecondaryBackground"
        >
          <button
            tabIndex={0}
            onClick={toggleModal}
            className="absolute right-2 top-2 flex flex-1 items-center justify-end transition-all duration-150 ease-in-out active:scale-95"
          >
            <CloseIcon size={22} color={"red"} />
          </button>
          <h2>Name Your New Athlete</h2>
          <input
            ref={inputRef}
            onChange={(e) => setAthleteName(e.target.value)}
            value={athleteName}
            className="w-3/4 rounded-[10px] bg-textInputBackground p-2 text-base placeholder:text-base md:w-11/12 md:p-4 md:text-xl md:placeholder:text-xl dark:bg-darkSecondaryTextInputBackground"
            type="text"
            name="Athlete name"
            id="AthleteName"
            placeholder="Athlete Name"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleCreateAthlete();
              }
            }}
          />
          <button
            onClick={handleCreateAthlete}
            className="z-10 rounded-[10px] bg-primary p-2 outline-none transition-all duration-150 active:scale-95 md:p-4"
          >
            <p className="text-center text-base text-white md:text-lg">
              Create Athlete
            </p>
          </button>
        </dialog>
      ) : null}
      {/*  */}

      <button
        onClick={toggleModal}
        className="z-10 rounded-[10px] bg-primary p-3 outline-none transition-all duration-150 active:scale-95 md:p-4"
      >
        <p className="text-center text-base text-white md:text-lg">
          New Athlete
        </p>
      </button>
    </div>
  );
};
export default React.memo(createNewAthleteButton);
