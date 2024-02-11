import React from "react";
interface Props {
  size: number;

  color: "blue" | "gray";
}
const PlusIcon = ({ color, size }: Props) => {
  const colorMap = {
    blue: "var(--color-blue)",
    gray: "grey",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill={colorMap[color]} />
      <rect
        x="12"
        y="27"
        width="6"
        height="24"
        rx="3"
        transform="rotate(-90 12 27)"
        fill="white"
      />
      <rect x="21" y="12" width="6" height="24" rx="3" fill="white" />
    </svg>
  );
};

export default PlusIcon;
