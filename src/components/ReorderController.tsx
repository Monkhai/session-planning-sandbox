import { DragControls } from "framer-motion";
import React from "react";
import ReorderIcon from "./icons/ReorderIcon";
interface Props {
  controls: DragControls;
  handleReorderEnd: () => void;
  noMargin?: boolean;
}
const ReorderController = ({ controls, handleReorderEnd, noMargin }: Props) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    controls.start(e);
  };

  return (
    <button
      onPointerUp={handleReorderEnd}
      ref={ref}
      style={{
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      className={"ml-2 hover:cursor-grab active:cursor-grabbing md:ml-4"}
    >
      <ReorderIcon size={28} />
    </button>
  );
};

export default ReorderController;
