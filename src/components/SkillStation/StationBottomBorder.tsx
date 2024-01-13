import React from "react";

interface Props {
  isLast: boolean;
}

const StationBottomBorder = ({ isLast }: Props) => {
  if (isLast) return null;

  return (
    <div className="bg-seperatorSecondary absolute bottom-0 left-14 h-[1px] w-[73.5%] print:hidden" />
  );
};

export default StationBottomBorder;
