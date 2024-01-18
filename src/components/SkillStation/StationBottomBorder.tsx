import React from "react";

interface Props {
  isLast: boolean;
}

const StationBottomBorder = ({ isLast }: Props) => {
  if (isLast) return null;

  return (
    <div className="absolute -bottom-2 left-14 h-[1px] w-[73.5%] bg-seperatorSecondary print:hidden" />
  );
};

export default React.memo(StationBottomBorder);
