import React from "react";

interface Props {
  children?: React.ReactNode;
  origin?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

const GenericModal = ({
  children,
  origin = "top",
  top,
  left,
  right,
  bottom,
}: Props) => {
  return (
    <div
      className={`absolute z-10 ${bottom ? bottom : ""} ${top ? top : ""} ${
        left ? left : ""
      } ${right ? right : ""}`}
      style={{
        transition: "all 0.150s ease-in-out",
        transformOrigin: origin,
      }}
    >
      {children}
    </div>
  );
};

export default GenericModal;
