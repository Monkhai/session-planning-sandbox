import React from "react";
import GenericModal from "./utility/GenericModal";

interface Props {
  onCreateNewSession: () => void;
}

const CreateNewSessionButton = ({ onCreateNewSession }: Props) => {
  const [showModal, setShowModal] = React.useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="relative flex items-center justify-center">
      {/* <dialog className="z-10 flex h-40 w-40 flex-col items-center justify-center overflow-hidden rounded-[10px] bg-black"></dialog> */}
      {/*  */}

      <button
        onClick={toggleModal}
        className="z-10 rounded-[10px] bg-primary p-3 transition-all duration-150 active:scale-95 md:p-4"
      >
        <p className="text-center text-base text-white md:text-lg">
          Create new Session
        </p>
      </button>
    </div>
  );
};
export default React.memo(CreateNewSessionButton);
