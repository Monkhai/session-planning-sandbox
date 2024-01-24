import React from "react";

interface Props {
  isLast: boolean;
}

const StationBottomBorder = ({ isLast }: Props) => {
  if (isLast) return null;

  return (
    <div className="absolute -bottom-2 left-[2%] z-0 h-[1px] w-[96%] bg-seperatorSecondary print:hidden dark:bg-darkSeperator" />
  );
};

export default StationBottomBorder;
