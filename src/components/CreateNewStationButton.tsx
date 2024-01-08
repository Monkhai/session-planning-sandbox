import React from "react";

interface Props {
  onClick: () => void;
}

const CreateNewStationButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="rounded-[12px] bg-primary p-4 transition-all duration-150 active:scale-95"
    >
      <p className="text-center text-lg text-white">Create new station</p>
    </button>
  );
};
export default CreateNewStationButton;
