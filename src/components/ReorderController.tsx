import { DragControls } from "framer-motion";
import React from "react";
import ReorderIcon from "./icons/ReorderIcon";
interface Props {
  controls: DragControls;
  size?: "small" | "large";
}
const ReorderController = ({ controls, size = "large" }: Props) => {
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
      <ReorderIcon size={size === "large" ? 28 : 22} />
    </button>
  );
};

export default ReorderController;
