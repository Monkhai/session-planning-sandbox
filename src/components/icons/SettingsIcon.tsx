import React from "react";

interface Props {
  size: number;
  color: "blue" | "gray";
}

const SettingsIcon = ({ size, color }: Props) => {
  const colorMap = {
    blue: "var(--color-blue)",
    gray: "grey",
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill={colorMap[color]} />
      <circle cx="12" cy="24" r="3" fill="white" />
      <circle cx="24" cy="24" r="3" fill="white" />
      <circle cx="36" cy="24" r="3" fill="white" />
    </svg>
  );
};

export default SettingsIcon;
