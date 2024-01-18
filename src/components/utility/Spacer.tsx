import React from "react";
interface Props {
  showOnPrint?: boolean;
}
const Spacer = ({ showOnPrint = true }: Props) => {
  if (!showOnPrint) return <div className="flex flex-1 print:hidden" />;

  return <div className="flex flex-1" />;
};

export default React.memo(Spacer);
