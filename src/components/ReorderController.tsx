import { DragControls } from "framer-motion";
import React from "react";
import ReorderIcon from "./icons/ReorderIcon";
interface Props {
  controls: DragControls;
}
const ReorderController = ({ controls }: Props) => {
  const onPointerDown = (e: React.PointerEvent) => {
    controls.start(e);
  };

  return (
    <button
      onPointerDown={onPointerDown}
      style={{
        touchAction: "none",
      }}
      className={"ml-2 hover:cursor-grab active:cursor-grabbing md:ml-4"}
    >
      <ReorderIcon size={28} />
    </button>
  );
};

export default ReorderController;
