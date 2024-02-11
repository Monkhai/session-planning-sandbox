import React from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import HelpModal from "./HelpModal";

interface Props {
  showContact: boolean;
  setShowContact: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
}

const HelpButton = ({ onLogout, showContact, setShowContact }: Props) => {
  const controlButtonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="relative flex flex-1 items-center justify-end">
      <div className="relative flex items-center justify-center outline-none">
        <button
          ref={controlButtonRef}
          onClick={() => setShowContact(!showContact)}
          className="active:scale-95"
        >
          <AiOutlineQuestionCircle size={30} color={"var(--color-blue)"} />
        </button>
        <HelpModal
          controlButtonRef={controlButtonRef}
          onLogout={onLogout}
          showContact={showContact}
          setShowContact={setShowContact}
        />
      </div>
    </div>
  );
};

export default React.memo(HelpButton);
