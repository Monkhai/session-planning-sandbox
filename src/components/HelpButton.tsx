import React from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import ContactMeModal from "./ContactMeModal";

interface Props {
  showContact: boolean;
  setShowContact: React.Dispatch<React.SetStateAction<boolean>>;
}

const HelpButton = ({ showContact, setShowContact }: Props) => {
  return (
    <div className="relative flex flex-1 items-center justify-end">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => setShowContact(!showContact)}
          className="active:scale-95"
        >
          <AiOutlineQuestionCircle size={30} color={"var(--color-blue)"} />
        </button>
        <ContactMeModal showContact={showContact} />
      </div>
    </div>
  );
};

export default HelpButton;
