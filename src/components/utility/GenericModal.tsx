import React from "react";

interface Props {
  children?: React.ReactNode;
  origin?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  showModal: boolean;
}

const GenericModal = ({
  children,
  origin = "top",
  top,
  left,
  right,
  bottom,
  showModal,
}: Props) => {
  return (
    <div
      className={`absolute z-10 ${bottom ? bottom : ""} ${top ? top : ""} ${
        left ? left : ""
      } ${right ? right : ""}`}
      style={{
        transition: "all 0.150s ease-in-out",
        transformOrigin: origin,
        scale: showModal ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
};

export default GenericModal;
