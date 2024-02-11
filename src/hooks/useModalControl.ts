import { useEffect } from "react";

const useModalControl = (
  ref: React.RefObject<HTMLDivElement> | React.RefObject<HTMLDialogElement>,
  showModal: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  controlButtonRef: React.RefObject<HTMLButtonElement>,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        controlButtonRef.current &&
        !controlButtonRef.current.contains(event.target as Node) &&
        showModal
      ) {
        setShowModal(false);
      }
    };

    // Attach event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setShowModal, showModal]);
};

export default useModalControl;
