import React, { useMemo } from "react";

interface Props {
  size: number;
}

const ReorderIcon = ({ size }: Props) => {
  const color = "#8E8E93";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="8" width="38" height="8" rx="4" ry="4" fill={color} />
      <rect x="5" y="20" width="38" height="8" rx="4" ry="4" fill={color} />
      <rect x="5" y="32" width="38" height="8" rx="4" ry="4" fill={color} />
    </svg>
  );
};

export default ReorderIcon;
