import React from "react";

interface Props {
  size: number;
  color: "blue" | "gray" | "red";
}

const CloseIcon = ({ color, size }: Props) => {
  const colorMap = {
    blue: "var(--color-blue)",
    gray: "grey",
    red: "rgb(239 68 68)",
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill={colorMap[color]} />
      <rect
        x="13.3934"
        y="17.636"
        width="6"
        height="24"
        rx="3"
        transform="rotate(-45 13.3934 17.636)"
        fill="white"
      />
      <rect
        x="30.364"
        y="13.3934"
        width="6"
        height="24"
        rx="3"
        transform="rotate(45 30.364 13.3934)"
        fill="white"
      />
    </svg>
  );
};

export default CloseIcon;
