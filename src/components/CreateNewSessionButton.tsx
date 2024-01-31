import React, { useCallback, useEffect } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface Props {
  onCreateNewSession: (name: string) => void;
}

const CreateNewSessionButton = ({ onCreateNewSession }: Props) => {
  const [sessionName, setSessionName] = React.useState("");
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

  const handleCreateSession = useCallback(() => {
    dialogRef.current?.close();
    setIsModalOpen(false);
    setSessionName("");
    onCreateNewSession(sessionName);
  }, [onCreateNewSession, sessionName, setIsModalOpen]);

  return (
    <div className="relative flex items-center justify-center">
      {isModalOpen ? (
        <dialog
          onClose={() => {
            setSessionName("");
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
            <IoCloseCircle className="h-6 w-6 md:h-7 md:w-7" color={"red"} />
          </button>
          <h2>Name Your New Session</h2>
          <input
            ref={inputRef}
            onChange={(e) => setSessionName(e.target.value)}
            value={sessionName}
            className="w-3/4 rounded-[10px] bg-textInputBackground p-2 text-base placeholder:text-base md:w-11/12 md:p-4 md:text-xl md:placeholder:text-xl dark:bg-darkSecondaryTextInputBackground"
            type="text"
            name="session name"
            id="sessionName"
            placeholder="Session Name"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleCreateSession();
              }
            }}
          />
          <button
            onClick={handleCreateSession}
            className="z-10 rounded-[10px] bg-primary p-3 outline-none transition-all duration-150 active:scale-95 md:p-4"
          >
            <p className="text-center text-base text-white md:text-lg">
              Create Session
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
          Create a New Session
        </p>
      </button>
    </div>
  );
};
export default React.memo(CreateNewSessionButton);
