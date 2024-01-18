import React, { useContext, useEffect, useState } from "react";
import { set } from "zod";
interface Props {
  stationName: string;
  setStationName: React.Dispatch<React.SetStateAction<string>>;
  stationNameRef: React.RefObject<HTMLTextAreaElement>;
}

const StationTitle = ({
  stationName,
  setStationName,
  stationNameRef,
}: Props) => {
  useEffect(() => {
    if (stationNameRef.current) {
      stationNameRef.current.style.height = "0"; // Reset height to shrink if text is deleted
      stationNameRef.current.style.height =
        stationNameRef.current.scrollHeight + "px";
    }
  }, [stationName]);

  return (
    <textarea
      inputMode="text"
      value={stationName}
      onChange={(event) => setStationName(event.target.value)}
      ref={stationNameRef}
      className="box-border w-full resize-none bg-transparent text-xl font-semibold outline-none active:outline-none  print:w-full print:text-base print:font-medium"
      placeholder="Station Name"
    />
  );
};

export default StationTitle;
