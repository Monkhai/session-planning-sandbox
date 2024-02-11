import React from "react";
interface Props {
  size: number;
}
const RemoveIcon = ({ size }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill="#FF3B30" />
      <rect
        x="12"
        y="27"
        width="6"
        height="24"
        rx="3"
        transform="rotate(-90 12 27)"
        fill="white"
      />
    </svg>
  );
};

export default RemoveIcon;
