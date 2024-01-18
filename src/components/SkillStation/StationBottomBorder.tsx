import React from "react";

interface Props {
  isLast: boolean;
}

const StationBottomBorder = ({ isLast }: Props) => {
  if (isLast) return null;

  return (
    <div className="dark:bg-darkSeperator absolute -bottom-2 left-14 z-0 h-[1px] w-[73.5%] bg-seperatorSecondary print:hidden" />
  );
};

export default StationBottomBorder;
